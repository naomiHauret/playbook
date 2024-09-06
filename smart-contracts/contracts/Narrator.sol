// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import './interfaces/IOracle.sol';

// @title PlaybookNarrator
// @notice This contract interacts with teeML oracle to handle narrative and dialog text generation using the OpenAI model.
contract PlaybookNarrator {
    struct GameSession {
        address owner;
        IOracle.Message[] messages;
        uint messagesCount;
    }

    // @notice Mapping from session ID to GameSession
    mapping(uint => GameSession) public gameSessions;
    uint private gameSessionsCount;

    // @notice Event emitted when a new chat is created
    event ChatCreated(address indexed owner, uint indexed chatId);

    // @notice Address of the contract owner
    address private owner;

    // @notice Address of the oracle contract
    address public oracleAddress;

    // @notice system prompt
    string public prompt;

    // @notice Event emitted when the oracle address is updated
    event OracleAddressUpdated(address indexed newOracleAddress);

    // @notice Configuration for the OpenAI request
    IOracle.OpenAiRequest private config;

    // @param initialOracleAddress Initial address of the oracle contract
    constructor(address initialOracleAddress, string memory systemPrompt) {
        owner = msg.sender;
        oracleAddress = initialOracleAddress;
        gameSessionsCount = 0;
        prompt = systemPrompt;

        config = IOracle.OpenAiRequest({
            model: 'gpt-4-turbo', // `gpt-4-turbo` is optimized for speed and cost-effectiveness
            frequencyPenalty: 1, // discourage repetition
            logitBias: '', // this could be player specific so that the model would avoid specific words (trigger warnings) ;
            maxTokens: 1000, // maximum number of tokens (words, punctuation, etc.) in the model's output ; 1000 should be fine as we expect single response
            presencePenalty: 1, // diversify the narrative
            responseFormat: '{"type":"text"}', // plain text ; if every characters had a wallet that would be added in a XMTP group, we'd use JSON
            seed: 0, // null
            stop: '', // null
            temperature: 10, // Example temperature (scaled up, 10 means 1.0), > 20 means null
            topP: 101, // Percentage 0-100, > 100 means null
            tools: '',
            toolChoice: '', // "none" or "auto"
            user: '' // null
        });
    }

    // @notice Ensures the caller is the contract owner
    modifier onlyOwner() {
        require(msg.sender == owner, 'Caller is not owner');
        _;
    }

    // @notice Ensures the caller is the oracle contract
    modifier onlyOracle() {
        require(msg.sender == oracleAddress, 'Caller is not oracle');
        _;
    }

    // @notice Updates the oracle address
    // @param newOracleAddress The new oracle address to set
    function setOracleAddress(address newOracleAddress) public onlyOwner {
        oracleAddress = newOracleAddress;
        emit OracleAddressUpdated(newOracleAddress);
    }

    // @notice Starts a new chat
    // @param message The initial message to start the chat with
    // @return The ID of the newly created chat
    function startChat(string memory message) public returns (uint) {
        GameSession storage run = gameSessions[gameSessionsCount];
        run.owner = msg.sender;
        IOracle.Message memory systemMessage = createTextMessage(
            'system',
            prompt
        );
        run.messages.push(systemMessage);
        IOracle.Message memory newMessage = createTextMessage('user', message);
        run.messages.push(newMessage);
        run.messagesCount = 2;

        uint currentId = gameSessionsCount;
        gameSessionsCount = gameSessionsCount + 1;

        IOracle(oracleAddress).createOpenAiLlmCall(currentId, config);
        emit ChatCreated(msg.sender, currentId);

        return currentId;
    }

    // @notice Handles the response from the oracle for an OpenAI LLM call
    // @param runId The ID of the chat run
    // @param response The response from the oracle
    // @param errorMessage Any error message
    // @dev Called by teeML oracle
    function onOracleOpenAiLlmResponse(
        uint runId,
        IOracle.OpenAiResponse memory response,
        string memory errorMessage
    ) public onlyOracle {
        GameSession storage run = gameSessions[runId];
        require(
            keccak256(
                abi.encodePacked(run.messages[run.messagesCount - 1].role)
            ) == keccak256(abi.encodePacked('user')),
            'No message to respond to'
        );

        if (!compareStrings(errorMessage, '')) {
            IOracle.Message memory newMessage = createTextMessage(
                'assistant',
                errorMessage
            );
            run.messages.push(newMessage);
            run.messagesCount++;
        } else {
            if (compareStrings(response.content, '')) {
                IOracle(oracleAddress).createFunctionCall(
                    runId,
                    response.functionName,
                    response.functionArguments
                );
            } else {
                IOracle.Message memory newMessage = createTextMessage(
                    'assistant',
                    response.content
                );
                run.messages.push(newMessage);
                run.messagesCount++;
            }
        }
    }

    // @notice Handles the response from the oracle for a function call
    // @param runId The ID of the chat run
    // @param response The response from the oracle
    // @param errorMessage Any error message
    // @dev Called by teeML oracle
    function onOracleFunctionResponse(
        uint runId,
        string memory response,
        string memory errorMessage
    ) public onlyOracle {
        GameSession storage run = gameSessions[runId];
        require(
            compareStrings(run.messages[run.messagesCount - 1].role, 'user'),
            'No function to respond to'
        );
        if (compareStrings(errorMessage, '')) {
            IOracle.Message memory newMessage = createTextMessage(
                'user',
                response
            );
            run.messages.push(newMessage);
            run.messagesCount++;
            IOracle(oracleAddress).createOpenAiLlmCall(runId, config);
        }
    }

    // @notice Adds a new message to an existing chat run
    // @param message The new message to add
    // @param runId The ID of the chat run
    function addMessage(string memory message, uint runId) public {
        GameSession storage run = gameSessions[runId];
        require(
            keccak256(
                abi.encodePacked(run.messages[run.messagesCount - 1].role)
            ) == keccak256(abi.encodePacked('assistant')),
            'No response to previous message'
        );
        require(run.owner == msg.sender, 'Only chat owner can add messages');

        IOracle.Message memory newMessage = createTextMessage('user', message);
        run.messages.push(newMessage);
        run.messagesCount++;

        IOracle(oracleAddress).createOpenAiLlmCall(runId, config);
    }

    // @notice Retrieves the message history of a chat run
    // @param chatId The ID of the chat run
    // @return An array of messages
    // @dev Called by teeML oracle
    function getMessageHistory(
        uint chatId
    ) public view returns (IOracle.Message[] memory) {
        return gameSessions[chatId].messages;
    }

    // @notice Creates a text message with the given role and content
    // @param role The role of the message
    // @param content The content of the message
    // @return The created message
    function createTextMessage(
        string memory role,
        string memory content
    ) private pure returns (IOracle.Message memory) {
        IOracle.Message memory newMessage = IOracle.Message({
            role: role,
            content: new IOracle.Content[](1)
        });
        newMessage.content[0].contentType = 'text';
        newMessage.content[0].value = content;
        return newMessage;
    }

    // @notice Compares two strings for equality
    // @param a The first string
    // @param b The second string
    // @return True if the strings are equal, false otherwise
    function compareStrings(
        string memory a,
        string memory b
    ) private pure returns (bool) {
        return (keccak256(abi.encodePacked((a))) ==
            keccak256(abi.encodePacked((b))));
    }
}
