/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Contract, ContractFactory, ContractTransactionResponse, Interface } from 'ethers'
import type { Signer, AddressLike, ContractDeployTransaction, ContractRunner } from 'ethers'
import type { NonPayableOverrides } from '../../common'
import type {
  PlaybookNarrator,
  PlaybookNarratorInterface,
} from '../../Narrator-Opus.sol/PlaybookNarrator'

const _abi = [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'initialOracleAddress',
        type: 'address',
      },
      {
        internalType: 'string',
        name: 'systemPrompt',
        type: 'string',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'chatId',
        type: 'uint256',
      },
    ],
    name: 'GameSessionStarted',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'newOracleAddress',
        type: 'address',
      },
    ],
    name: 'OracleAddressUpdated',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'message',
        type: 'string',
      },
      {
        internalType: 'uint256',
        name: 'sessionId',
        type: 'uint256',
      },
    ],
    name: 'addMessage',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'gameSessions',
    outputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'messagesCount',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'sessionId',
        type: 'uint256',
      },
    ],
    name: 'getMessageHistory',
    outputs: [
      {
        components: [
          {
            internalType: 'string',
            name: 'role',
            type: 'string',
          },
          {
            components: [
              {
                internalType: 'string',
                name: 'contentType',
                type: 'string',
              },
              {
                internalType: 'string',
                name: 'value',
                type: 'string',
              },
            ],
            internalType: 'struct IOracle.Content[]',
            name: 'content',
            type: 'tuple[]',
          },
        ],
        internalType: 'struct IOracle.Message[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'sessionId',
        type: 'uint256',
      },
      {
        internalType: 'string',
        name: 'response',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'errorMessage',
        type: 'string',
      },
    ],
    name: 'onOracleFunctionResponse',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'sessionId',
        type: 'uint256',
      },
      {
        components: [
          {
            internalType: 'string',
            name: 'id',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'content',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'functionName',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'functionArguments',
            type: 'string',
          },
          {
            internalType: 'uint64',
            name: 'created',
            type: 'uint64',
          },
          {
            internalType: 'string',
            name: 'model',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'systemFingerprint',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'object',
            type: 'string',
          },
          {
            internalType: 'uint32',
            name: 'completionTokens',
            type: 'uint32',
          },
          {
            internalType: 'uint32',
            name: 'promptTokens',
            type: 'uint32',
          },
          {
            internalType: 'uint32',
            name: 'totalTokens',
            type: 'uint32',
          },
        ],
        internalType: 'struct IOracle.OpenAiResponse',
        name: 'response',
        type: 'tuple',
      },
      {
        internalType: 'string',
        name: 'errorMessage',
        type: 'string',
      },
    ],
    name: 'onOracleOpenAiLlmResponse',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'oracleAddress',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'prompt',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOracleAddress',
        type: 'address',
      },
    ],
    name: 'setOracleAddress',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'message',
        type: 'string',
      },
    ],
    name: 'startGame',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const

const _bytecode =
  '0x6040608081523462000d52576200296f90813803806200001f8162000d97565b938439820191818184031262000d525780516001600160a01b038116919082900362000d52576020810151906001600160401b03821162000d52570183601f8201121562000d52578051906001600160401b038211620006ce576200008e601f8301601f191660200162000d97565b948286526020838301011162000d525760005b82811062000d3c57505060206000918501015260018060a01b03193381600254161760025560035416176003556000600155815160018060401b038111620006ce57600454600181811c9116801562000d31575b6020821014620006ad57601f811162000cc7575b50602092601f821160011462000c5c579281929360009262000c50575b50508160011b916000199060031b1c1916176004555b8051906101a082016001600160401b03811183821017620006ce5781526200016362000d57565b601a81527f636c617564652d332d352d736f6e6e65742d32303234303632300000000000006020820152825260156020830152620001a062000d77565b60008152818301526103e8606083015260156080830152620001c162000d57565b600f81526e7b2274797065223a2274657874227d60881b602082015260a0830152600060c0830152620001f362000d77565b6000815260e0830152600a61010083015260656101208301526200021662000d77565b600081526101408301526200022a62000d57565b60048152636175746f60e01b60208201526101608301526200024b62000d77565b60008152610180830152815180519092906001600160401b038111620006ce57600554600181811c9116801562000c45575b6020821014620006ad57601f811162000bfb575b506020601f821160011462000b8c578192939460009262000b80575b50508160011b916000199060031b1c1916176005555b602081015160ff19600654169060ff16176006558181015191825160018060401b038111620006ce57600754600181811c9116801562000b75575b6020821014620006ad57601f811162000b0f575b506020601f821160011462000aa0578192939460009262000a94575b50508160011b916000199060031b1c1916176007555b63ffffffff60608301511660085490608084015160201b64ff00000000169164ffffffffff1916171760085560a082015191825160018060401b038111620006ce57600954600181811c9116801562000a89575b6020821014620006ad57601f811162000a23575b506020601f8211600114620009b45781929394600092620009a8575b50508160011b916000199060031b1c1916176009555b60c0810151600a5560e081015180519092906001600160401b038111620006ce57600b54600181811c911680156200099d575b6020821014620006ad57601f811162000937575b506020601f8211600114620008c85781929394600092620008bc575b50508160011b916000199060031b1c191617600b555b610100820151600c55610120820151600d5561014082015180519092906001600160401b038111620006ce57600e54600181811c91168015620008b1575b6020821014620006ad57601f811162000858575b506020601f8211600114620007df5781929394600092620007d3575b50508160011b916000199060031b1c191617600e555b6101608101518051906001600160401b038211620006ce57600f54600181811c91168015620007c8575b6020821014620006ad57601f81116200076f575b50602090601f8311600114620006f05761018093929160009183620006e4575b50508160011b916000199060031b1c191617600f555b015180519091906001600160401b038111620006ce57601054600181811c91168015620006c3575b6020821014620006ad57601f811162000643575b50602092601f8211600114620005d85792819293600092620005cc575b50508160011b916000199060031b1c1916176010555b51611b71908162000dbe8239f35b015190503880620005a8565b601f19821693601060005260206000209160005b8681106200062a575083600195961062000610575b505050811b01601055620005be565b015160001960f88460031b161c1916905538808062000601565b91926020600181928685015181550194019201620005ec565b60106000527f1b6847dc741a1b0cd08d278845f9d819d87b734759afb55fe2de5cb82a9ae672601f830160051c81019160208410620006a2575b601f0160051c01905b8181106200069557506200058b565b6000815560010162000686565b90915081906200067d565b634e487b7160e01b600052602260045260246000fd5b90607f169062000577565b634e487b7160e01b600052604160045260246000fd5b01519050388062000539565b600f60009081526000805160206200294f833981519152929190601f198516905b818110620007565750916001939185610180979694106200073c575b505050811b01600f556200054f565b015160001960f88460031b161c191690553880806200072d565b9293602060018192878601518155019501930162000711565b600f6000526000805160206200294f833981519152601f840160051c81019160208510620007bd575b601f0160051c01905b818110620007b0575062000519565b60008155600101620007a1565b909150819062000798565b90607f169062000505565b015190503880620004c5565b600e60009081526000805160206200292f8339815191529190601f198416905b8181106200083f5750958360019596971062000825575b505050811b01600e55620004db565b015160001960f88460031b161c1916905538808062000816565b9192602060018192868b015181550194019201620007ff565b600e6000526000805160206200292f833981519152601f830160051c81019160208410620008a6575b601f0160051c01905b818110620008995750620004a9565b600081556001016200088a565b909150819062000881565b90607f169062000495565b01519050388062000441565b600b60005260206000209060005b601f19841681106200091e5750600193949583601f1981161062000904575b505050811b01600b5562000457565b015160001960f88460031b161c19169055388080620008f5565b9091602060018192858a015181550193019101620008d6565b600b6000527f0175b7a638427703f0dbe7bb9bbf987a2551717b34e79f33b5b1008d1fa01db9601f830160051c81016020841062000995575b601f830160051c820181106200098857505062000425565b6000815560010162000970565b508062000970565b90607f169062000411565b015190503880620003c8565b600960005260206000209060005b601f198416811062000a0a5750600193949583601f19811610620009f0575b505050811b01600955620003de565b015160001960f88460031b161c19169055388080620009e1565b9091602060018192858a015181550193019101620009c2565b60096000527f6e1540171b6c0c960b71a7020d9f60077f6af931a8bbf590da0223dacf75c7af601f830160051c81016020841062000a81575b601f830160051c8201811062000a74575050620003ac565b6000815560010162000a5c565b508062000a5c565b90607f169062000398565b0151905038806200032e565b600760005260206000209060005b601f198416811062000af65750600193949583601f1981161062000adc575b505050811b0160075562000344565b015160001960f88460031b161c1916905538808062000acd565b9091602060018192858a01518155019301910162000aae565b60076000527fa66cc928b5edb82af9bd49922954155ab7b0942694bea4ce44661d9a8736c688601f830160051c81016020841062000b6d575b601f830160051c8201811062000b6057505062000312565b6000815560010162000b48565b508062000b48565b90607f1690620002fe565b015190503880620002ad565b600560005260206000209060005b601f198416811062000be25750600193949583601f1981161062000bc8575b505050811b01600555620002c3565b015160001960f88460031b161c1916905538808062000bb9565b9091602060018192858a01518155019301910162000b9a565b60056000526020600020601f830160051c81016020841062000c3d575b601f830160051c8201811062000c3057505062000291565b6000815560010162000c18565b508062000c18565b90607f16906200027d565b01519050388062000126565b601f19821693600460005260206000209160005b86811062000cae575083600195961062000c94575b505050811b016004556200013c565b015160001960f88460031b161c1916905538808062000c85565b9192602060018192868501518155019401920162000c70565b60046000527f8a35acfbc15ff81a39ae7d344fd709f28e8600b4aa8c65c6b64bfe7fe36bd19b601f830160051c8101916020841062000d26575b601f0160051c01905b81811062000d19575062000109565b6000815560010162000d0a565b909150819062000d01565b90607f1690620000f5565b80602080928401015182828901015201620000a1565b600080fd5b60408051919082016001600160401b03811183821017620006ce57604052565b60405190602082016001600160401b03811183821017620006ce57604052565b6040519190601f01601f191682016001600160401b03811183821017620006ce5760405256fe608060409080825260048036101561001657600080fd5b600091823560e01c90816334a8014b14610c7a575080634c69c00f14610bce5780634cecd88e1461081757806354a470fc146106085780637397454d146104745780637c65d71114610439578063941fac3714610240578063a89ae4ba146102175763d542c4d51461008757600080fd5b3461021357602092836003193601126101e757813567ffffffffffffffff811161020f5760026100bb819236908601610d23565b600154865285875261013d84872091336bffffffffffffffffffffffff60a01b84541617835561013761012087516100f281610cb3565b600681526573797374656d60d01b8c82015288519061011b8261011481610e12565b0383610d01565b611a54565b9161012f600186019384610fde565b61011b6113d8565b90610fde565b015560015491600183018084116101fc578361017e92879260015560018060a01b03600354169087865180968195829463cbbfd0b760e01b845283016113f8565b03925af180156101f25783929186916101bf575b505051927f1fc8d32bac9afe437051494ae7118488f3a2c1a0d69a927edac07a97558d0d40339180a38152f35b90809293503d83116101eb575b6101d68183610d01565b810103126101e75781908438610192565b8280fd5b503d6101cc565b82513d86823e3d90fd5b634e487b7160e01b855260118252602485fd5b8380fd5b5080fd5b82843461021357816003193601126102135760035490516001600160a01b039091168152602090f35b509134610213578060031936011261021357823567ffffffffffffffff81116101e7576102709036908501610d23565b90602435938484526020928484528285209060018201600283019182546000198101908111610426576102a39083610f4c565b5086516102c5816102b78b82018095611960565b03601f198101835282610d01565b51902086518881019068185cdcda5cdd185b9d60ba1b8252600981526102ea81610cb3565b519020036103e35792546001600160a01b039390841633036103925792889261031f61034a9796936101378a9761011b6113d8565b6103298154611a07565b9055600354169087855180978195829463cbbfd0b760e01b845283016113f8565b03925af1908115610389575061035e578280f35b813d8311610382575b6103718183610d01565b8101031261037f5781808280f35b80fd5b503d610367565b513d85823e3d90fd5b855162461bcd60e51b8152808601889052602560248201527f4f6e6c79207468652067616d65206d61737465722063616e20616464206d6573604482015264736167657360d81b6064820152608490fd5b855162461bcd60e51b8152808601889052601f60248201527f4e6f20726573706f6e736520746f2070726576696f7573206d657373616765006044820152606490fd5b634e487b7160e01b895260118652602489fd5b82843461021357816003193601126102135780516104709161045e8261011481610e12565b51918291602083526020830190610db3565b0390f35b5082346101e75760603660031901126101e75767ffffffffffffffff908235602435838111610604576104aa9036908601610d23565b92604435908111610604576104c29036908601610d23565b9060018060a01b03946104da8660035416331461191d565b81875260209587875284882093600260018601950190815460001981019081116105f15761051d610524610511610532938a610f4c565b508a5192838092610eb6565b0382610d01565b61052c6113d8565b90611ae6565b156105ae57865161054e9161054682610ce5565b8b8252611ae6565b610556578880f35b61031f889561013761056a9961011b6113d8565b03925af19081156103895750610585575b8080808080808880f35b813d83116105a7575b6105988183610d01565b8101031261037f57818061057b565b503d61058e565b865162461bcd60e51b81528085018a9052601960248201527f4e6f2066756e6374696f6e20746f20726573706f6e6420746f000000000000006044820152606490fd5b634e487b7160e01b8b526011855260248bfd5b8580fd5b503461021357602090816003193601126101e757358252818152828220600190810180549094919261063982611a16565b9161064684519384610d01565b8083528183018097875282872087915b83831061074a575050505082519481860192828752518093528386016005948085871b8901019895835b86851061068d57898b038af35b909192939495969786819b603f198c82030187528a51826106b5825189855289850190610db3565b91015191838183039101528151808252838201908480828a1b850101940192875b878b8483106106fd575050505050505081909a019501950193969594929190999799610680565b61073890899395979992949698601f19888203018a52836107288c5193845190808552840190610db3565b9201519084818403910152610db3565b970195019101918c95949391926106d6565b968685829b99829798995161075e81610cb3565b835161076e8161051d818a610eb6565b815285850180548e61077f82611a16565b9261078c88519485610d01565b828452815285812090888785015b8483106107c3575050505050600294508382015281520192019201919098969895949395610656565b89600293959799929496989a51906107da82610cb3565b80516107ea8161051d818c610eb6565b8252516107fd8161051d81898c01610eb6565b8382015281520193019101908c959391888d98969461079a565b5082346101e75760031960603682011261020f57602480359267ffffffffffffffff918535838611610bca576101609081868836030112610bc657835191820182811086821117610bb457845286880135858111610bb05761087e908936918a0101610d23565b825282870135858111610bb05761089a908936918a0101610d23565b97602095868401998a526044890135818111610bac576108bf908336918c0101610d23565b9386810194855260648a0135828111610ba8576108e1908436918d0101610d23565b99606082019a8b5260848101358381168103610ba457608083015260a4810135838111610ba45761091790853691840101610d23565b60a083015260c4810135838111610ba45761093790853691840101610d23565b60c083015260e481013590838211610ba4576101446109939161096261014094883691840101610d23565b60e08601526109746101048201610d7f565b6101008601526109876101248201610d7f565b61012086015201610d7f565b910152604435908111610ba0576109ad9036908301610d23565b9660018060a01b03986109c58a60035416331461191d565b838c528b8852868c2099600260018c019b019b8c546000198101908111610b8e576109f0908d610f4c565b506102b7610a068c8c5192839182018095611960565b51902089518b810190633ab9b2b960e11b8252878152610a2581610cb3565b51902003610b4c57908d94939291610a4a8a51610a4181610ce5565b8781528d611ae6565b610a7857505050505050505050505090610137610a699261011b6119e2565b610a738154611a07565b905580f35b909396999c9295989b9194979a50610a9f81518d5190610a9782610ce5565b8a8252611ae6565b15610b2e575050508996949260609998969492610ae5610af4936003541697519151918b519c8d9a8b998a98634b04236b60e01b8a528901528701526064860190610db3565b91848303016044850152610db3565b03925af19081156103895750610b0957505080f35b813d8311610b27575b610b1c8183610d01565b8101031261037f5780f35b503d610b12565b9750985099505050505050610a69935061013791505161011b6119e2565b885162461bcd60e51b81528086018b90526018818a01527f4e6f206d65737361676520746f20726573706f6e6420746f00000000000000006044820152606490fd5b634e487b7160e01b8f5260118652888ffd5b8a80fd5b8d80fd5b8c80fd5b8b80fd5b8980fd5b634e487b7160e01b8a5260418952838afd5b8880fd5b8780fd5b508290346101e75760203660031901126101e75780356001600160a01b038181169391849003610c7657600254163303610c3d575050600380546001600160a01b031916821790557f107a9fafffb7ac890f780879e423760c9ffea8dcee8045681f40f542aede2cb88280a280f35b906020606492519162461bcd60e51b8352820152601360248201527221b0b63632b91034b9903737ba1037bbb732b960691b6044820152fd5b8480fd5b9291905034610213576020366003190112610213579083913581528060205220600260018060a01b038254169101549082526020820152f35b6040810190811067ffffffffffffffff821117610ccf57604052565b634e487b7160e01b600052604160045260246000fd5b6020810190811067ffffffffffffffff821117610ccf57604052565b90601f8019910116810190811067ffffffffffffffff821117610ccf57604052565b81601f82011215610d7a5780359067ffffffffffffffff8211610ccf5760405192610d58601f8401601f191660200185610d01565b82845260208383010111610d7a57816000926020809301838601378301015290565b600080fd5b359063ffffffff82168203610d7a57565b60005b838110610da35750506000910152565b8181015183820152602001610d93565b90602091610dcc81518092818552858086019101610d90565b601f01601f1916010190565b90600182811c92168015610e08575b6020831014610df257565b634e487b7160e01b600052602260045260246000fd5b91607f1691610de7565b60045460009291610e2282610dd8565b80825291600190818116908115610e995750600114610e4057505050565b9192935060046000527f8a35acfbc15ff81a39ae7d344fd709f28e8600b4aa8c65c6b64bfe7fe36bd19b916000925b848410610e8157505060209250010190565b80546020858501810191909152909301928101610e6f565b915050602093945060ff929192191683830152151560051b010190565b9060009291805491610ec783610dd8565b918282526001938481169081600014610f295750600114610ee9575b50505050565b90919394506000526020928360002092846000945b838610610f15575050505001019038808080610ee3565b805485870183015294019385908201610efe565b9294505050602093945060ff191683830152151560051b01019038808080610ee3565b8054821015610f685760005260206000209060011b0190600090565b634e487b7160e01b600052603260045260246000fd5b818110610f89575050565b60008155600101610f7e565b610f9f8154610dd8565b9081610fa9575050565b81601f60009311600114610fbb575055565b908083918252610fda601f60208420940160051c840160018501610f7e565b5555565b90815490680100000000000000009182811015610ccf57611006906001948582018155610f4c565b9190916113c257805180519267ffffffffffffffff93848111610ccf57869061102f8354610dd8565b93601f94858111611388575b5060209085831160011461131f57602094929160009183611314575b5050600019600383901b1c191690831b1781555b019201518051948511610ccf5782548584558086106112a7575b5060009283526020808420939491015b8585106110a55750505050505050565b8051908151805190848211610ccf5781906110c08854610dd8565b878111611277575b5060209087831160011461121457600092611209575b5050600019600383901b1c191690891b1785555b6020888601920151918251848111610ccf5789936111108354610dd8565b8781116111cf575b506020908783116001146111635791806020949260029694600092611158575b5050600019600383901b1c191690861b1790555b01940194019392611095565b015190503880611138565b90601f1983169184600052816000209260005b8181106111b75750928792859260029896602098961061119e575b505050811b01905561114c565b015160001960f88460031b161c19169055388080611191565b8284015185558e989094019360209384019301611176565b6111fa9084600052602060002060058a808701821c83019360208810611200575b01901c0190610f7e565b38611118565b935082936111f0565b0151905038806110de565b908b9350601f1983169189600052816000209260005b81811061125f57508411611246575b505050811b0185556110f2565b015160001960f88460031b161c19169055388080611239565b8284015185558e96909401936020938401930161122a565b6112a19089600052602060002060058a808701821c830193602088106112005701901c0190610f7e565b386110c8565b6001600160ff1b0381811682036112fe57861686036112fe5783600052602060002090871b81019086881b015b8181106112e15750611085565b806112ed600292610f95565b6112f8898201610f95565b016112d4565b634e487b7160e01b600052601160045260246000fd5b015190503880611057565b90601f1983169185600052816000209260005b81811061137057509185939185602098969410611357575b505050811b01815561106b565b015160001960f88460031b161c1916905538808061134a565b8284015185558c969094019360209384019301611332565b6113b3908560005260206000208780860160051c820192602087106113b9575b0160051c0190610f7e565b3861103b565b925081926113a8565b634e487b7160e01b600052600060045260246000fd5b604051906113e582610cb3565b60048252633ab9b2b960e11b6020830152565b90815260206040818301526101a091826040820152600060059182549461141e86610dd8565b806101e084015260019687811690816000146118ff57506001146118a2575b5060065460000b6060830152603f1990818385030160808401526000936007549061146782610dd8565b91828252888a8216918260001461188457505060011461182a575b505060085463ffffffff811660a0850152861c60000b60c0840152818385030160e0840152600093600954906114b782610dd8565b91828252888a8216918260001461180c5750506001146117b2575b5050600a546101008401528284038201610120840152600b546000946114f782610dd8565b91828252888a8216918260001461179457505060011461173a575b5050600c54610140840152600d546101608401528284038201610180840152600e5460009461154082610dd8565b91828252888a8216918260001461171c5750506001146116c2575b5050828403820190830152600f5460009361157582610dd8565b918282528789821691826000146116a2575050600114611644575b50506101c090828403019101526000936010546115ac81610dd8565b808452938183169182156116255750506001146115cb575b5050505090565b9293509060106000527f1b6847dc741a1b0cd08d278845f9d819d87b734759afb55fe2de5cb82a9ae67292846000945b83861061161157505050500101388080806115c4565b8054858701830152940193859082016115fb565b925093929495505060ff1916848401521515901b0101388080806115c4565b8691929450600f6000527f8d1108e10bcb7c27dddfc02ed9d693a074039d026cf4ea4240b40f7d581ac80290886000925b85841061168c57505001019290506101c038611590565b80548385018601528994909301928a9101611675565b60ff191683820152921515871b90910190910193506101c0905038611590565b87929550600e6000527fbb7b4a454dc3493923482f07822329ed19e8244eff582cc204f8554c3620c3fd91896000935b82851061170657505050010192388061155b565b80548585018701528a95909401938b91016116f2565b60ff191683820152921515881b90910190910194503890508061155b565b87929550600b6000527f0175b7a638427703f0dbe7bb9bbf987a2551717b34e79f33b5b1008d1fa01db991896000935b82851061177e575050500101923880611512565b80548585018701528a95909401938b910161176a565b60ff191683820152921515881b909101909101945038905080611512565b8792955060096000527f6e1540171b6c0c960b71a7020d9f60077f6af931a8bbf590da0223dacf75c7af91896000935b8285106117f65750505001019238806114d2565b80548585018701528a95909401938b91016117e2565b60ff191683820152921515881b9091019091019450389050806114d2565b8792955060076000527fa66cc928b5edb82af9bd49922954155ab7b0942694bea4ce44661d9a8736c68891896000935b82851061186e575050500101923880611482565b80548585018701528a95909401938b910161185a565b60ff191683820152921515881b909101909101945038905080611482565b909250836000527f036b6384b5eca791c62761152d0c79bb0604c104a5fb6f4eb0703f3154bb3db085876000925b8484106118e9575050506102009150820101913861143d565b80546102008588010152019101908787916118d0565b929450506102009160ff1916828401521515841b820101913861143d565b1561192457565b60405162461bcd60e51b815260206004820152601460248201527343616c6c6572206973206e6f74206f7261636c6560601b6044820152606490fd5b60009291815461196f81610dd8565b926001918083169081156119c7575060011461198b5750505050565b90919293945060005260209081600020906000915b8583106119b65750505050019038808080610ee3565b8054858401529183019181016119a0565b60ff1916845250505081151590910201915038808080610ee3565b604051906119ef82610cb3565b6009825268185cdcda5cdd185b9d60ba1b6020830152565b60001981146112fe5760010190565b67ffffffffffffffff8111610ccf5760051b60200190565b60405190611a3b82610cb3565b60606020838281520152565b805115610f685760200190565b90611a5d611a2e565b5060405190611a6b82610cb3565b6001825260005b602080821015611a945790602091611a88611a2e565b90828601015201611a72565b505090611ae060209160405194611aaa86610cb3565b8552611abb83860191808352611a47565b5160405190611ac982610cb3565b60048252631d195e1d60e21b858301525251611a47565b51015290565b9060405191602092611b14848281611b078183019687815193849201610d90565b8101038084520182610d01565b51902091611b34604051918281611b078183019687815193849201610d90565b519020149056fea26469706673582212204be49422053384c2c78d74062a235ea49960c2e8653485ce172a9002e4d14a7264736f6c63430008140033bb7b4a454dc3493923482f07822329ed19e8244eff582cc204f8554c3620c3fd8d1108e10bcb7c27dddfc02ed9d693a074039d026cf4ea4240b40f7d581ac802'

type PlaybookNarratorConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>

const isSuperArgs = (
  xs: PlaybookNarratorConstructorParams,
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1

export class PlaybookNarrator__factory extends ContractFactory {
  constructor(...args: PlaybookNarratorConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args)
    } else {
      super(_abi, _bytecode, args[0])
    }
  }

  override getDeployTransaction(
    initialOracleAddress: AddressLike,
    systemPrompt: string,
    overrides?: NonPayableOverrides & { from?: string },
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(initialOracleAddress, systemPrompt, overrides || {})
  }
  override deploy(
    initialOracleAddress: AddressLike,
    systemPrompt: string,
    overrides?: NonPayableOverrides & { from?: string },
  ) {
    return super.deploy(initialOracleAddress, systemPrompt, overrides || {}) as Promise<
      PlaybookNarrator & {
        deploymentTransaction(): ContractTransactionResponse
      }
    >
  }
  override connect(runner: ContractRunner | null): PlaybookNarrator__factory {
    return super.connect(runner) as PlaybookNarrator__factory
  }

  static readonly bytecode = _bytecode
  static readonly abi = _abi
  static createInterface(): PlaybookNarratorInterface {
    return new Interface(_abi) as PlaybookNarratorInterface
  }
  static connect(address: string, runner?: ContractRunner | null): PlaybookNarrator {
    return new Contract(address, _abi, runner) as unknown as PlaybookNarrator
  }
}
