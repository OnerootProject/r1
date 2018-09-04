const Web3 = require("web3")
var web3 = new Web3("http://127.0.0.1:8545")
const assert=require("assert")
var json=[{"constant":true,"inputs":[],"name":"stop","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"withdrawEnabled","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"withdrawAllowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"token","type":"address"},{"name":"amount","type":"uint256"}],"name":"depositToken","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"withdrawn","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"admins","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"admin","type":"address"},{"name":"isAdmin","type":"bool"}],"name":"setAdmin","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"bytes32"}],"name":"orderFilled","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"latestApply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"token","type":"address"},{"name":"amount","type":"uint256"}],"name":"withdrawNoLimit","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"addresses","type":"address[3]"},{"name":"values","type":"uint256[3]"},{"name":"v","type":"uint8"},{"name":"r","type":"bytes32"},{"name":"s","type":"bytes32"}],"name":"adminWithdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"stopTrade","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"enabled","type":"bool"}],"name":"enableWithdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"lock","type":"uint256"}],"name":"changeLockTime","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"feeRate","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"canceled","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"acc","type":"address"},{"name":"asFee","type":"bool"}],"name":"setFeeAccount","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"token","type":"address"},{"name":"amount","type":"uint256"}],"name":"applyWithdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"addresses","type":"address[11]"},{"name":"values","type":"uint256[11]"},{"name":"v","type":"uint8[2]"},{"name":"r","type":"bytes32[2]"},{"name":"s","type":"bytes32[2]"}],"name":"trade","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"tokenBuy","type":"address"},{"name":"amountBuy","type":"uint256"},{"name":"tokenSell","type":"address"},{"name":"amountSell","type":"uint256"},{"name":"base","type":"address"},{"name":"expires","type":"uint256"},{"name":"nonce","type":"uint256"},{"name":"feeToken","type":"address"}],"name":"getOrderHash","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"fr","type":"uint256"}],"name":"changeFeeRate","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"user","type":"address"},{"name":"tokens","type":"address[]"}],"name":"refund","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"addresses","type":"address[11][]"},{"name":"values","type":"uint256[11][]"},{"name":"v","type":"uint8[2][]"},{"name":"r","type":"bytes32[2][]"},{"name":"s","type":"bytes32[2][]"}],"name":"batchTrade","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"users","type":"address[]"},{"name":"nonces","type":"uint256[]"}],"name":"batchCancel","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"token","type":"address"},{"name":"user","type":"address"}],"name":"approveWithdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"deposit","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"applyList","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"tokenList","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"feeAccounts","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"applyWait","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"token","type":"address"},{"name":"amount","type":"uint256"}],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"token","type":"address"},{"name":"user","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"payable":false,"stateMutability":"nonpayable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"token","type":"address"},{"indexed":true,"name":"user","type":"address"},{"indexed":false,"name":"amount","type":"uint256"},{"indexed":false,"name":"balance","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"token","type":"address"},{"indexed":true,"name":"user","type":"address"},{"indexed":false,"name":"amount","type":"uint256"},{"indexed":false,"name":"balance","type":"uint256"}],"name":"Withdraw","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"token","type":"address"},{"indexed":true,"name":"user","type":"address"},{"indexed":false,"name":"amount","type":"uint256"},{"indexed":false,"name":"time","type":"uint256"}],"name":"ApplyWithdraw","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"maker","type":"address"},{"indexed":true,"name":"taker","type":"address"},{"indexed":false,"name":"amount","type":"uint256"},{"indexed":false,"name":"makerFee","type":"uint256"},{"indexed":false,"name":"takerFee","type":"uint256"},{"indexed":false,"name":"makerNonce","type":"uint256"},{"indexed":false,"name":"takerNonce","type":"uint256"}],"name":"Trade","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"}]

//should be replaced when update
var code="0x606060405262015180600a908155600b55600c805461ffff1916905560008054600160a060020a033316600160a060020a0319909116179055612de9806100476000396000f3006060604052600436106101925763ffffffff60e060020a60003504166307da68f581146101a25780632287e96a146101c9578063233ac008146101dc578063338b5dea146102135780633823d66c14610237578063429b62e51461024d5780634b0bddd21461026c578063560b3cba146102905780637420a0ec146102b257806374cf6f49146102d75780637955a65f146102f95780638baeefce146103695780638da5cb5b1461037c57806392e33d14146103ab57806396cf5227146103c3578063978bbdb9146103d95780639e47b4b6146103ec578063a4de3c191461040b578063a537b7161461042f578063aa22678014610451578063add371001461053b578063affca9321461057c578063b40f035214610592578063b67590aa146105ef578063bcfe070f14610842578063be1ef5c1146108d1578063d0e30db0146108f6578063da141bd5146108fe578063dc3ef12614610923578063e2e71f9314610948578063f2eaee0214610967578063f2fde38b1461097a578063f3fef3a314610999578063f7888aec146109bb575b341561019d57600080fd5b600080fd5b34156101ad57600080fd5b6101b56109e0565b604051901515815260200160405180910390f35b34156101d457600080fd5b6101b56109ee565b34156101e757600080fd5b610201600160a060020a03600435811690602435166109f7565b60405190815260200160405180910390f35b341561021e57600080fd5b610235600160a060020a0360043516602435610a14565b005b341561024257600080fd5b6101b5600435610b78565b341561025857600080fd5b6101b5600160a060020a0360043516610b8d565b341561027757600080fd5b610235600160a060020a03600435166024351515610ba2565b341561029b57600080fd5b610201600160a060020a0360043516602435610bfd565b34156102bd57600080fd5b610201600160a060020a0360043581169060243516610c1a565b34156102e257600080fd5b610235600160a060020a0360043516602435610c37565b341561030457600080fd5b6102356004606481600360606040519081016040529190828260608082843782019150505050509190806060019060038060200260405190810160405291908282606080828437509395505050823560ff169260208101359250604001359050610e02565b341561037457600080fd5b6102356111f5565b341561038757600080fd5b61038f611221565b604051600160a060020a03909116815260200160405180910390f35b34156103b657600080fd5b6102356004351515611230565b34156103ce57600080fd5b61023560043561125e565b34156103e457600080fd5b61020161128e565b34156103f757600080fd5b610201600160a060020a0360043516611294565b341561041657600080fd5b610235600160a060020a036004351660243515156112a6565b341561043a57600080fd5b610235600160a060020a0360043516602435611301565b341561045c57600080fd5b610235600461016481600b610160604051908101604052919082826101608082843782019150505050509190806101600190600b80602002604051908101604052919082826101608082843782019150505050509190806040019060028060200260405190810160405280929190826002602002808284378201915050505050919080604001906002806020026040519081016040528092919082600260200280828437820191505050505091908060400190600280602002604051908101604052809291908260026020028082843750939550611411945050505050565b341561054657600080fd5b610201600160a060020a03600435811690602435906044358116906064359060843581169060a4359060c4359060e435166119e0565b341561058757600080fd5b610235600435611a65565b341561059d57600080fd5b61023560048035600160a060020a0316906044602480359081019083013580602080820201604051908101604052809392919081815260200183836020028082843750949650611a9395505050505050565b34156105fa57600080fd5b61023560046024813581810190830135806020818102016040519081016040528181529291906000602085015b8282101561066557610160808302860190600b9060405190810160405291908282610160808284375050509183525050600190910190602001610627565b505050505091908035906020019082018035906020019080806020026020016040519081016040528181529291906000602085015b828210156106d857610160808302860190600b906040519081016040529190828261016080828437505050918352505060019091019060200161069a565b505050505091908035906020019082018035906020019080806020026020016040519081016040528181529291906000602085015b8282101561074c57604080830286019060029080519081016040528092919082600260200280828437505050918352505060019091019060200161070d565b505050505091908035906020019082018035906020019080806020026020016040519081016040528181529291906000602085015b828210156107c0576040808302860190600290805190810160405280929190826002602002808284375050509183525050600190910190602001610781565b505050505091908035906020019082018035906020019080806020026020016040519081016040528181529291906000602085015b828210156108345760408083028601906002908051908101604052809291908260026020028082843750505091835250506001909101906020016107f5565b505050505091905050611c79565b341561084d57600080fd5b610235600460248135818101908301358060208181020160405190810160405280939291908181526020018383602002808284378201915050505050509190803590602001908201803590602001908080602002602001604051908101604052809392919081815260200183836020028082843750949650611d3395505050505050565b34156108dc57600080fd5b610235600160a060020a0360043581169060243516611e28565b610235611eef565b341561090957600080fd5b610201600160a060020a0360043581169060243516611fab565b341561092e57600080fd5b610201600160a060020a0360043581169060243516611fc8565b341561095357600080fd5b6101b5600160a060020a0360043516611fe5565b341561097257600080fd5b610201611ffa565b341561098557600080fd5b610235600160a060020a0360043516612000565b34156109a457600080fd5b610235600160a060020a036004351660243561209b565b34156109c657600080fd5b610201600160a060020a036004358116906024351661231f565b600c54610100900460ff1681565b600c5460ff1681565b600660209081526000928352604080842090915290825290205481565b600160a060020a0382161515610a2957600080fd5b600160a060020a0380831660009081526003602090815260408083203390941683529290522054610a5a908261234a565b600160a060020a0380841660008181526003602090815260408083203395861684529091528082209490945590926323b872dd92913091869190516020015260405160e060020a63ffffffff8616028152600160a060020a0393841660048201529190921660248201526044810191909152606401602060405180830381600087803b1515610ae857600080fd5b6102c65a03f11515610af957600080fd5b505050604051805190501515610b0e57600080fd5b600160a060020a038281166000818152600360209081526040808320339095168084529490915290819020547fdcbc1c05240f31ff3ad067ef1ee35ce4997762752e3a095284754544f4c709d7918591905191825260208201526040908101905180910390a35050565b60056020526000908152604090205460ff1681565b60016020526000908152604090205460ff1681565b60005433600160a060020a03908116911614610bbd57600080fd5b600160a060020a0382161515610bd257600080fd5b600160a060020a03919091166000908152600160205260409020805460ff1916911515919091179055565b600460209081526000928352604080842090915290825290205481565b600860209081526000928352604080842090915290825290205481565b600c5460ff161515610c4857600080fd5b600160a060020a0380831660009081526003602090815260408083203390941683529290522054811115610c7b57600080fd5b600160a060020a0380831660009081526003602090815260408083203390941683529290522054610cac9082612360565b600160a060020a03808416600081815260036020908152604080832033909516835293905291909120919091551515610d1557600160a060020a03331681156108fc0282604051600060405180830381858888f193505050501515610d1057600080fd5b610d98565b81600160a060020a031663a9059cbb338360006040516020015260405160e060020a63ffffffff8516028152600160a060020a0390921660048301526024820152604401602060405180830381600087803b1515610d7257600080fd5b6102c65a03f11515610d8357600080fd5b505050604051805190501515610d9857600080fd5b600160a060020a038281166000818152600360209081526040808320339095168084529490915290819020547ff341246adaac6f497bc2a656f546ab9e182111d630394f0c57c710a59a2cb567918591905191825260208201526040908101905180910390a35050565b600160a060020a03331660009081526001602052604081205481908190819081908190819060ff161515610e3557600080fd5b60408c0151600160a060020a03811660009081526002602052604090205460ff161515610e6157600080fd5b8c51975060208d0151965060408d015195508b51945060208c0151935060408c0151600160a060020a038089166000908152600360209081526040808320938d1683529290522054909350851115610eb857600080fd5b610ec28584612372565b925030888887876040516c01000000000000000000000000600160a060020a039687168102825294861685026014820152929094169092026028820152603c810191909152605c810191909152607c0160405190819003902060008181526005602052604090205490925060ff1615610f3a57600080fd5b60008281526005602052604090819020805460ff19166001908117909155600160a060020a038a16918490517f19457468657265756d205369676e6564204d6573736167653a0a3332000000008152601c810191909152603c0160405180910390208d8d8d6040516000815260200160405260006040516020015260405193845260ff90921660208085019190915260408085019290925260608401929092526080909201915160208103908084039060008661646e5a03f11515610ffe57600080fd5b505060206040510351600160a060020a03161461101a57600080fd5b600160a060020a038088166000908152600360209081526040808320938c168352929052205461104a9086612360565b600160a060020a0388811660009081526003602090815260408083208d851684529091528082209390935590881681522054611086908461234a565b600160a060020a038089166000908152600360209081526040808320938b16835292905220556110b68584612360565b9450600160a060020a03871615156110fe57600160a060020a03881685156108fc0286604051600060405180830381858888f1935050505015156110f957600080fd5b611181565b86600160a060020a031663a9059cbb898760006040516020015260405160e060020a63ffffffff8516028152600160a060020a0390921660048301526024820152604401602060405180830381600087803b151561115b57600080fd5b6102c65a03f1151561116c57600080fd5b50505060405180519050151561118157600080fd5b600160a060020a038781166000818152600360209081526040808320948d168084529490915290819020547ff341246adaac6f497bc2a656f546ab9e182111d630394f0c57c710a59a2cb567918991905191825260208201526040908101905180910390a350505050505050505050505050565b60005433600160a060020a0390811691161461121057600080fd5b600c805461ff001916610100179055565b600054600160a060020a031681565b60005433600160a060020a0390811691161461124b57600080fd5b600c805460ff1916911515919091179055565b60005433600160a060020a0390811691161461127957600080fd5b62093a8081111561128957600080fd5b600a55565b600b5481565b60096020526000908152604090205481565b60005433600160a060020a039081169116146112c157600080fd5b600160a060020a03821615156112d657600080fd5b600160a060020a03919091166000908152600260205260409020805460ff1916911515919091179055565b600160a060020a03808316600090815260076020908152604080832033909416835292905290812054611334908361234a565b600160a060020a03808516600081815260036020908152604080832033909516808452948252808320549383526006825280832094835293905291909120549192509061138290839061234a565b111561138d57600080fd5b600160a060020a03808416600081815260076020908152604080832033909516808452948252808320869055838352600882528083208584529091529081902042908190557f9279426ccdba165d0a4e2dadd069b13c58656379fa8a37530455ae6539ca8f28918691905191825260208201526040908101905180910390a3505050565b611419612d61565b611421612d61565b600160a060020a03331660009081526001602052604081205460ff16151561144857600080fd5b610140880151600160a060020a03811660009081526002602052604090205460ff16151561147557600080fd5b600c54610100900460ff161561148a57600080fd5b610160604051908101604052808a51600160a060020a0316815260200160408b0151600160a060020a031681526020018951815260200160408a0151815260200160808b0151600160a060020a0316815260200160808a0151815260200160c08a015181526020016101008a015181526000602082015260400160c08b0151600160a060020a031681526020016101008b0151600160a060020a0316905293506101606040519081016040528060208b0151600160a060020a0316815260200160608b0151600160a060020a031681526020018960016020020151815260200160608a0151815260200160a08b0151600160a060020a0316815260200160a08a0151815260200160e08a015181526020016101208a015181526000602082015260400160e08b0151600160a060020a031681526020016101208b0151600160a060020a0316905292506101408801519150438460c00151101580156115f35750438360c0015110155b15156115fe57600080fd5b600960008560800151600160a060020a0316600160a060020a03168152602001908152602001600020548460e00151101580156116685750600960008460800151600160a060020a0316600160a060020a03168152602001908152602001600020548360e0015110155b151561167357600080fd5b826101200151600160a060020a0316846101200151600160a060020a03161480156116b457508260200151600160a060020a03168451600160a060020a0316145b80156116d657508251600160a060020a03168460200151600160a060020a0316145b15156116e157600080fd5b8251600160a060020a0316836101200151600160a060020a0316148061172157508260200151600160a060020a0316836101200151600160a060020a0316145b151561172c57600080fd5b61175b84518560400151866020015187606001518861012001518960c001518a60e001518b61014001516119e0565b61010085015261179083518460400151856020015186606001518761012001518860c001518960e001518a61014001516119e0565b6101008401526080840151600160a060020a031660018561010001516040517f19457468657265756d205369676e6564204d6573736167653a0a3332000000008152601c810191909152603c016040519081900390208951895189516040516000815260200160405260006040516020015260405193845260ff90921660208085019190915260408085019290925260608401929092526080909201915160208103908084039060008661646e5a03f1151561184b57600080fd5b505060206040510351600160a060020a03161461186757600080fd5b8260800151600160a060020a031660018461010001516040517f19457468657265756d205369676e6564204d6573736167653a0a3332000000008152601c810191909152603c0160405190819003902060208a015160208a015160208a01516040516000815260200160405260006040516020015260405193845260ff90921660208085019190915260408085019290925260608401929092526080909201915160208103908084039060008661646e5a03f1151561192557600080fd5b505060206040510351600160a060020a03161461194157600080fd5b61195284846101408c0151856123a1565b8260800151600160a060020a03168460800151600160a060020a03167f01f5d7c359dba416997ea6c723ea4663e9ad524f956ed8bb3b5234e6475a7285848760a001518760a001518960e001518960e00151604051808681526020018581526020018481526020018381526020018281526020019550505050505060405180910390a3505050505050505050565b60003089898989898989896040516c01000000000000000000000000600160a060020a039a8b1681028252988a1689026014820152602881019790975294881687026048870152605c8601939093529086168502607c850152609084015260b08301529092160260d082015260e4016040518091039020905098975050505050505050565b60005433600160a060020a03908116911614611a8057600080fd5b600a811015611a8e57600080fd5b600b55565b600160a060020a0333166000908152600160205260408120548190819060ff161515611abe57600080fd5b600092505b8351831015611c7257838381518110611ad857fe5b90602001906020020151600160a060020a038082166000908152600360209081526040808320938a16835292905290812054919350909150811115611c6757600160a060020a038083166000818152600360209081526040808320948a168352939052918220919091551515611b7e57600160a060020a03851681156108fc0282604051600060405180830381858888f193505050501515611b7957600080fd5b611c01565b81600160a060020a031663a9059cbb868360006040516020015260405160e060020a63ffffffff8516028152600160a060020a0390921660048301526024820152604401602060405180830381600087803b1515611bdb57600080fd5b6102c65a03f11515611bec57600080fd5b505050604051805190501515611c0157600080fd5b600160a060020a038281166000818152600360209081526040808320948a168084529490915290819020547ff341246adaac6f497bc2a656f546ab9e182111d630394f0c57c710a59a2cb567918591905191825260208201526040908101905180910390a35b600190920191611ac3565b5050505050565b600160a060020a03331660009081526001602052604081205460ff161515611ca057600080fd5b5060005b8551811015611d2b57611d23868281518110611cbc57fe5b90602001906020020151868381518110611cd257fe5b90602001906020020151868481518110611ce857fe5b90602001906020020151868581518110611cfe57fe5b90602001906020020151868681518110611d1457fe5b90602001906020020151611411565b600101611ca4565b505050505050565b600160a060020a03331660009081526001602052604081205460ff161515611d5a57600080fd5b8151835114611d6857600080fd5b5060005b8251811015611e235760096000848381518110611d8557fe5b90602001906020020151600160a060020a0316600160a060020a0316815260200190815260200160002054828281518110611dbc57fe5b906020019060200201511015611dd157600080fd5b818181518110611ddd57fe5b9060200190602002015160096000858481518110611df757fe5b90602001906020020151600160a060020a03168152602081019190915260400160002055600101611d6c565b505050565b600160a060020a03331660009081526001602052604090205460ff161515611e4f57600080fd5b600160a060020a03808316600081815260066020908152604080832094861680845294825280832054938352600782528083209483529390529190912054611e97919061234a565b600160a060020a03928316600081815260066020908152604080832095909616808352948152858220939093558181526007835284812084825283528481208190559081526008825283812092815291905290812055565b33600160a060020a031660009081527f3617319a054d772f909f7c479a2cebe5066e836a939412e32403c99029b92eff6020526040902054611f31903461234a565b600160a060020a03331660008181527f3617319a054d772f909f7c479a2cebe5066e836a939412e32403c99029b92eff6020526040808220849055919290917fdcbc1c05240f31ff3ad067ef1ee35ce4997762752e3a095284754544f4c709d79134915191825260208201526040908101905180910390a3565b600760209081526000928352604080842090915290825290205481565b600360209081526000928352604080842090915290825290205481565b60026020526000908152604090205460ff1681565b600a5481565b60005433600160a060020a0390811691161461201b57600080fd5b600160a060020a038116151561203057600080fd5b600054600160a060020a0380831691167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a36000805473ffffffffffffffffffffffffffffffffffffffff1916600160a060020a0392909216919091179055565b600160a060020a03808316600090815260036020908152604080832033909416835292905220548111156120ce57600080fd5b600160a060020a03808316600090815260066020908152604080832033909416835292905220548111156121f957600160a060020a0380831660009081526008602090815260408083203390941683529290522054158015906121635750600a54600160a060020a0380841660009081526008602090815260408083203390941683529290522054612161904290612360565b115b151561216e57600080fd5b600160a060020a03808316600081815260066020908152604080832033909516808452948252808320549383526007825280832094835293905291909120546121b7919061234a565b600160a060020a038084166000818152600660209081526040808320339095168084529482528083209590955591815260078252838120928152919052908120555b600160a060020a038083166000908152600660209081526040808320339094168352929052205481111561222c57600080fd5b600160a060020a038083166000908152600660209081526040808320339094168352929052205461225d9082612360565b600160a060020a03808416600081815260066020908152604080832033909516808452948252808320959095559181526003825283812092815291905220546122a69082612360565b600160a060020a03808416600081815260036020908152604080832033909516808452948252808320959095558282526008815284822093825292909252918120551515610d1557600160a060020a03331681156108fc0282604051600060405180830381858888f193505050501515610d1057600080fd5b600160a060020a03918216600090815260036020908152604080832093909416825291909152205490565b60008282018381101561235957fe5b9392505050565b60008183101561236c57fe5b50900390565b6000808290508361238584600b54612af5565b111561235957600b548481151561239857fe5b04949350505050565b6000806000806000806123bc8a604001518a60400151612af5565b6123ce8b606001518b60600151612af5565b10156123d957600080fd5b600095508594508851600160a060020a0316896101200151600160a060020a0316141561260f5761244f8a60400151600460008d60800151600160a060020a0316600160a060020a0316815260200190815260200160002060008d61010001518152602081019190915260400160002054612360565b93506124a08960600151600460008c60800151600160a060020a0316600160a060020a0316815260200190815260200160002060008c61010001518152602081019190915260400160002054612360565b92506000871180156124b25750838711155b80156124be5750828711155b15156124c957600080fd5b86945089604001516124df8b6060015187612af5565b8115156124e857fe5b049550612536600460008b60800151600160a060020a0316600160a060020a0316815260200190815260200160002060008b610100015181526020810191909152604001600020548661234a565b600460008b60800151600160a060020a0316600160a060020a0316815260200190815260200160002060008b6101000151815260208101919091526040016000908120919091556125c89060049060808d0151600160a060020a0316600160a060020a0316815260200190815260200160002060008c610100015181526020810191909152604001600020548661234a565b600460008c60800151600160a060020a0316600160a060020a0316815260200190815260200160002060008c6101000151815260208101919091526040016000205561281a565b61265e8960400151600460008c60800151600160a060020a0316600160a060020a0316815260200190815260200160002060008c61010001518152602081019190915260400160002054612360565b92506126af8a60600151600460008d60800151600160a060020a0316600160a060020a0316815260200190815260200160002060008d61010001518152602081019190915260400160002054612360565b93506000871180156126c15750838711155b80156126cd5750828711155b15156126d857600080fd5b86955089606001516126ee8b6040015188612af5565b8115156126f757fe5b049450612745600460008b60800151600160a060020a0316600160a060020a0316815260200190815260200160002060008b610100015181526020810191909152604001600020548761234a565b600460008b60800151600160a060020a0316600160a060020a0316815260200190815260200160002060008b6101000151815260208101919091526040016000908120919091556127d79060049060808d0151600160a060020a0316600160a060020a0316815260200190815260200160002060008c610100015181526020810191909152604001600020548761234a565b600460008c60800151600160a060020a0316600160a060020a0316815260200190815260200160002060008c610100015181526020810191909152604001600020555b6128258a8987612b19565b9150612832898988612b19565b905061288e600360008b60200151600160a060020a0316600160a060020a0316815260200190815260200160002060008b60800151600160a060020a0316600160a060020a031681526020019081526020016000205486612360565b600360008b60200151600160a060020a0316600160a060020a0316815260200190815260200160002060008b60800151600160a060020a0316600160a060020a0316815260200190815260200160002081905550612945600360008b60000151600160a060020a0316600160a060020a0316815260200190815260200160002060008b60800151600160a060020a0316600160a060020a03168152602001908152602001600020546129408884612360565b61234a565b600360008b51600160a060020a0316600160a060020a0316815260200190815260200160002060008b60800151600160a060020a0316600160a060020a03168152602001908152602001600020819055506129f0600360008c60200151600160a060020a0316600160a060020a0316815260200190815260200160002060008c60800151600160a060020a0316600160a060020a031681526020019081526020016000205487612360565b600360008c60200151600160a060020a0316600160a060020a0316815260200190815260200160002060008c60800151600160a060020a0316600160a060020a0316815260200190815260200160002081905550612aa2600360008c60000151600160a060020a0316600160a060020a0316815260200190815260200160002060008c60800151600160a060020a0316600160a060020a03168152602001908152602001600020546129408785612360565b600360008c51600160a060020a0316600160a060020a0316815260200190815260200160002060008c60800151600160a060020a0316815260208101919091526040016000205550505050505050505050565b6000828202831580612b115750828482811515612b0e57fe5b04145b151561235957fe5b600080610140850151600160a060020a031615612cd35760036000866101400151600160a060020a0316600160a060020a0316815260200190815260200160002060008660800151600160a060020a0316600160a060020a03168152602001908152602001600020548560a001511115612b9257600080fd5b612bd360036000876101400151600160a060020a039081168252602080830193909352604091820160009081209189168152925290205460a087015161234a565b60036000876101400151600160a060020a0316600160a060020a03168152602001908152602001600020600086600160a060020a0316600160a060020a0316815260200190815260200160002081905550612c8360036000876101400151600160a060020a0316600160a060020a0316815260200190815260200160002060008760800151600160a060020a0316600160a060020a03168152602001908152602001600020548660a00151612360565b60036000876101400151600160a060020a0316600160a060020a0316815260200190815260200160002060008760800151600160a060020a03168152602081019190915260400160002055612d59565b612ce1838660a00151612372565b60a08601908152519050612d28600360008751600160a060020a039081168252602080830193909352604091820160009081209189168152925290205460a087015161234a565b600360008751600160a060020a03908116825260208083019390935260409182016000908120918916815292529020555b949350505050565b6101606040519081016040908152600080835260208301819052908201819052606082018190526080820181905260a0820181905260c0820181905260e0820181905261010082018190526101208201819052610140820152905600a165627a7a723058203cd82973b3527dd267bda41b9d0d8cef72134d9071080d3743592c97b31dea740029"

var account=web3.eth.accounts.wallet.add("0x5c4296a778e2c785aa344b8166be02dbbd7bf59396e1a2ea77aaa21cde25994e")//test account
var admin="0x899b5aAb87326CaFc71189F87A36584E02BE2C83",feeAcc="0x4712b2a4f82758Cc35D34DF1f1e9E45aed7DF257"

it("deploy", async () => {
    await deployContract(account,json,code,[])

})
it("initial params",async()=>{
    //contract address from step 1:deploy contract
    var contractAddr="0xBCd6B22A25F7B0D42506D3B40741FC64485B1ac7"
    var myContract = new web3.eth.Contract(json,contractAddr)

    var result=await myContract.methods.setAdmin(admin,true).send({from:account.address,gas:100000})

    assert.equal(result.status, 1, "set admin failed")
    result=await myContract.methods.setFeeAccount(feeAcc,true).send({from:account.address,gas:100000})

    assert.equal(result.status, 1, "set fee account failed")
})

function deployContract(account,abi, code, arguments) {
    var myContract = new web3.eth.Contract(abi)
    return myContract.deploy({
        data: code,
        arguments: arguments
    }).send({
        from: account.address,
        gasPrice: web3.utils.toWei("10", "gwei"),
        gas: 4000000
    })
        .on('error', console.log)
        .on('receipt', console.log)
}