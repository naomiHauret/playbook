/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumberish,
  BytesLike,
  FunctionFragment,
  Result,
  Interface,
  EventFragment,
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from 'ethers'
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedLogDescription,
  TypedListener,
  TypedContractMethod,
} from '../common'

export declare namespace IOracle {
  export type ContentStruct = { contentType: string; value: string }

  export type ContentStructOutput = [contentType: string, value: string] & {
    contentType: string
    value: string
  }

  export type MessageStruct = {
    role: string
    content: IOracle.ContentStruct[]
  }

  export type MessageStructOutput = [role: string, content: IOracle.ContentStructOutput[]] & {
    role: string
    content: IOracle.ContentStructOutput[]
  }

  export type OpenAiResponseStruct = {
    id: string
    content: string
    functionName: string
    functionArguments: string
    created: BigNumberish
    model: string
    systemFingerprint: string
    object: string
    completionTokens: BigNumberish
    promptTokens: BigNumberish
    totalTokens: BigNumberish
  }

  export type OpenAiResponseStructOutput = [
    id: string,
    content: string,
    functionName: string,
    functionArguments: string,
    created: bigint,
    model: string,
    systemFingerprint: string,
    object: string,
    completionTokens: bigint,
    promptTokens: bigint,
    totalTokens: bigint,
  ] & {
    id: string
    content: string
    functionName: string
    functionArguments: string
    created: bigint
    model: string
    systemFingerprint: string
    object: string
    completionTokens: bigint
    promptTokens: bigint
    totalTokens: bigint
  }
}

export interface PlaybookNarratorInterface extends Interface {
  getFunction(
    nameOrSignature:
      | 'addMessage'
      | 'gameSessions'
      | 'getMessageHistory'
      | 'onOracleFunctionResponse'
      | 'onOracleOpenAiLlmResponse'
      | 'oracleAddress'
      | 'prompt'
      | 'setOracleAddress'
      | 'startGame',
  ): FunctionFragment

  getEvent(nameOrSignatureOrTopic: 'GameSessionStarted' | 'OracleAddressUpdated'): EventFragment

  encodeFunctionData(functionFragment: 'addMessage', values: [string, BigNumberish]): string
  encodeFunctionData(functionFragment: 'gameSessions', values: [BigNumberish]): string
  encodeFunctionData(functionFragment: 'getMessageHistory', values: [BigNumberish]): string
  encodeFunctionData(
    functionFragment: 'onOracleFunctionResponse',
    values: [BigNumberish, string, string],
  ): string
  encodeFunctionData(
    functionFragment: 'onOracleOpenAiLlmResponse',
    values: [BigNumberish, IOracle.OpenAiResponseStruct, string],
  ): string
  encodeFunctionData(functionFragment: 'oracleAddress', values?: undefined): string
  encodeFunctionData(functionFragment: 'prompt', values?: undefined): string
  encodeFunctionData(functionFragment: 'setOracleAddress', values: [AddressLike]): string
  encodeFunctionData(functionFragment: 'startGame', values: [string]): string

  decodeFunctionResult(functionFragment: 'addMessage', data: BytesLike): Result
  decodeFunctionResult(functionFragment: 'gameSessions', data: BytesLike): Result
  decodeFunctionResult(functionFragment: 'getMessageHistory', data: BytesLike): Result
  decodeFunctionResult(functionFragment: 'onOracleFunctionResponse', data: BytesLike): Result
  decodeFunctionResult(functionFragment: 'onOracleOpenAiLlmResponse', data: BytesLike): Result
  decodeFunctionResult(functionFragment: 'oracleAddress', data: BytesLike): Result
  decodeFunctionResult(functionFragment: 'prompt', data: BytesLike): Result
  decodeFunctionResult(functionFragment: 'setOracleAddress', data: BytesLike): Result
  decodeFunctionResult(functionFragment: 'startGame', data: BytesLike): Result
}

export namespace GameSessionStartedEvent {
  export type InputTuple = [owner: AddressLike, chatId: BigNumberish]
  export type OutputTuple = [owner: string, chatId: bigint]
  export interface OutputObject {
    owner: string
    chatId: bigint
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>
  export type Filter = TypedDeferredTopicFilter<Event>
  export type Log = TypedEventLog<Event>
  export type LogDescription = TypedLogDescription<Event>
}

export namespace OracleAddressUpdatedEvent {
  export type InputTuple = [newOracleAddress: AddressLike]
  export type OutputTuple = [newOracleAddress: string]
  export interface OutputObject {
    newOracleAddress: string
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>
  export type Filter = TypedDeferredTopicFilter<Event>
  export type Log = TypedEventLog<Event>
  export type LogDescription = TypedLogDescription<Event>
}

export interface PlaybookNarrator extends BaseContract {
  connect(runner?: ContractRunner | null): PlaybookNarrator
  waitForDeployment(): Promise<this>

  interface: PlaybookNarratorInterface

  queryFilter<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined,
  ): Promise<Array<TypedEventLog<TCEvent>>>
  queryFilter<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined,
  ): Promise<Array<TypedEventLog<TCEvent>>>

  on<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>,
  ): Promise<this>
  on<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>,
  ): Promise<this>

  once<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>,
  ): Promise<this>
  once<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>,
  ): Promise<this>

  listeners<TCEvent extends TypedContractEvent>(
    event: TCEvent,
  ): Promise<Array<TypedListener<TCEvent>>>
  listeners(eventName?: string): Promise<Array<Listener>>
  removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>

  addMessage: TypedContractMethod<[message: string, sessionId: BigNumberish], [void], 'nonpayable'>

  gameSessions: TypedContractMethod<
    [arg0: BigNumberish],
    [[string, bigint] & { owner: string; messagesCount: bigint }],
    'view'
  >

  getMessageHistory: TypedContractMethod<
    [sessionId: BigNumberish],
    [IOracle.MessageStructOutput[]],
    'view'
  >

  onOracleFunctionResponse: TypedContractMethod<
    [sessionId: BigNumberish, response: string, errorMessage: string],
    [void],
    'nonpayable'
  >

  onOracleOpenAiLlmResponse: TypedContractMethod<
    [sessionId: BigNumberish, response: IOracle.OpenAiResponseStruct, errorMessage: string],
    [void],
    'nonpayable'
  >

  oracleAddress: TypedContractMethod<[], [string], 'view'>

  prompt: TypedContractMethod<[], [string], 'view'>

  setOracleAddress: TypedContractMethod<[newOracleAddress: AddressLike], [void], 'nonpayable'>

  startGame: TypedContractMethod<[message: string], [bigint], 'nonpayable'>

  getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T

  getFunction(
    nameOrSignature: 'addMessage',
  ): TypedContractMethod<[message: string, sessionId: BigNumberish], [void], 'nonpayable'>
  getFunction(
    nameOrSignature: 'gameSessions',
  ): TypedContractMethod<
    [arg0: BigNumberish],
    [[string, bigint] & { owner: string; messagesCount: bigint }],
    'view'
  >
  getFunction(
    nameOrSignature: 'getMessageHistory',
  ): TypedContractMethod<[sessionId: BigNumberish], [IOracle.MessageStructOutput[]], 'view'>
  getFunction(
    nameOrSignature: 'onOracleFunctionResponse',
  ): TypedContractMethod<
    [sessionId: BigNumberish, response: string, errorMessage: string],
    [void],
    'nonpayable'
  >
  getFunction(
    nameOrSignature: 'onOracleOpenAiLlmResponse',
  ): TypedContractMethod<
    [sessionId: BigNumberish, response: IOracle.OpenAiResponseStruct, errorMessage: string],
    [void],
    'nonpayable'
  >
  getFunction(nameOrSignature: 'oracleAddress'): TypedContractMethod<[], [string], 'view'>
  getFunction(nameOrSignature: 'prompt'): TypedContractMethod<[], [string], 'view'>
  getFunction(
    nameOrSignature: 'setOracleAddress',
  ): TypedContractMethod<[newOracleAddress: AddressLike], [void], 'nonpayable'>
  getFunction(
    nameOrSignature: 'startGame',
  ): TypedContractMethod<[message: string], [bigint], 'nonpayable'>

  getEvent(
    key: 'GameSessionStarted',
  ): TypedContractEvent<
    GameSessionStartedEvent.InputTuple,
    GameSessionStartedEvent.OutputTuple,
    GameSessionStartedEvent.OutputObject
  >
  getEvent(
    key: 'OracleAddressUpdated',
  ): TypedContractEvent<
    OracleAddressUpdatedEvent.InputTuple,
    OracleAddressUpdatedEvent.OutputTuple,
    OracleAddressUpdatedEvent.OutputObject
  >

  filters: {
    'GameSessionStarted(address,uint256)': TypedContractEvent<
      GameSessionStartedEvent.InputTuple,
      GameSessionStartedEvent.OutputTuple,
      GameSessionStartedEvent.OutputObject
    >
    GameSessionStarted: TypedContractEvent<
      GameSessionStartedEvent.InputTuple,
      GameSessionStartedEvent.OutputTuple,
      GameSessionStartedEvent.OutputObject
    >

    'OracleAddressUpdated(address)': TypedContractEvent<
      OracleAddressUpdatedEvent.InputTuple,
      OracleAddressUpdatedEvent.OutputTuple,
      OracleAddressUpdatedEvent.OutputObject
    >
    OracleAddressUpdated: TypedContractEvent<
      OracleAddressUpdatedEvent.InputTuple,
      OracleAddressUpdatedEvent.OutputTuple,
      OracleAddressUpdatedEvent.OutputObject
    >
  }
}
