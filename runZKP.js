module.exports = function(callback) {  
    eth = web3.eth;
    Alice = '0x627306090abab3a6e1400e9345bc60c78a8bef57';
    console.log('Alice\'address:', Alice);
    var lastBlock=eth.getBlock('latest').number;
    console.log('# of blocks is:', lastBlock+1,'\n');
    var receivers=[],txs=[],blocks=[],i;
    for(i=0;i <= lastBlock; i++){
      blocks[i] = eth.getBlock(i);
    }

    for(i=1; i<=lastBlock;i++){
      txs[i]=blocks[i].transactions[0];
      receivers[i]=eth.getTransactionReceipt(txs[i]);
      console.log('tx',i,' is at:',txs[i]);
      if(receivers[i].contractAddress){
        console.log('contract is at:', receivers[i].contractAddress,'\n');
      } 
    }


  var SchnorrABI=[{
    "contractName": "Schnorr",
    "abi": [],
    "bytecode": "0x60606040523415600e57600080fd5b603580601b6000396000f3006060604052600080fd00a165627a7a723058206268e318e0b1e7b3e706b05e537374cf76835aa3cc7041a95f268114153be2a90029",
    "deployedBytecode": "0x6060604052600080fd00a165627a7a723058206268e318e0b1e7b3e706b05e537374cf76835aa3cc7041a95f268114153be2a90029",
    "sourceMap": "123:1319:2:-;;;;;;;;;;;;;;;;;",
    "deployedSourceMap": "123:1319:2:-;;;;;",
    "source": "pragma solidity ^0.4.14;\r\n\r\nimport \"./Curve.sol\";\r\n\r\n// https://en.wikipedia.org/wiki/Proof_of_knowledge#Schnorr_protocol\r\nlibrary Schnorr\r\n{\r\n    // Costs ~85000 gas, 2x ecmul, + mulmod, addmod, hash etc. overheads\r\n\tfunction CreateProof( uint256 secret, uint256 message )\r\n\t    constant internal\r\n\t    returns (uint256[2] out_pubkey, uint256 out_s, uint256 out_e)\r\n\t{\r\n\t\tCurve.G1Point memory xG = Curve.g1mul(Curve.P1(), secret % Curve.N());\r\n\t\tout_pubkey[0] = xG.X;\r\n\t\tout_pubkey[1] = xG.Y;\r\n\t\tuint256 k = uint256(keccak256(message, secret)) % Curve.N();\r\n\t\tCurve.G1Point memory kG = Curve.g1mul(Curve.P1(), k);\r\n\t\tout_e = uint256(keccak256(out_pubkey[0], out_pubkey[1], kG.X, kG.Y, message));\r\n\t\tout_s = Curve.submod(k, mulmod(secret, out_e, Curve.N()));\r\n\t}\r\n\r\n\t// Costs ~85000 gas, 2x ecmul, 1x ecadd, + small overheads\r\n\tfunction CalcProof( uint256[2] pubkey, uint256 message, uint256 s, uint256 e )\r\n\t    constant internal\r\n\t    returns (uint256)\r\n\t{\r\n\t    Curve.G1Point memory sG = Curve.g1mul(Curve.P1(), s % Curve.N());\r\n\t    Curve.G1Point memory xG = Curve.G1Point(pubkey[0], pubkey[1]);\r\n\t    Curve.G1Point memory kG = Curve.g1add(sG, Curve.g1mul(xG, e));\r\n\t    return uint256(keccak256(pubkey[0], pubkey[1], kG.X, kG.Y, message));\r\n\t}\r\n\t\r\n\tfunction VerifyProof( uint256[2] pubkey, uint256 message, uint256 s, uint256 e )\r\n\t    constant internal\r\n\t    returns (bool)\r\n\t{\r\n\t    return e == CalcProof(pubkey, message, s, e);\r\n\t}\r\n}",
    "sourcePath": "C:\\Users\\eason\\Documents\\GitHub\\SmartWerewolf\\contracts\\schnorr.sol",
    "ast": {
      "absolutePath": "/C/Users/eason/Documents/GitHub/SmartWerewolf/contracts/schnorr.sol",
      "exportedSymbols": {
        "Schnorr": [
          1022
        ]
      },
      "id": 1023,
      "nodeType": "SourceUnit",
      "nodes": [
        {
          "id": 816,
          "literals": [
            "solidity",
            "^",
            "0.4",
            ".14"
          ],
          "nodeType": "PragmaDirective",
          "src": "0:24:2"
        },
        {
          "absolutePath": "/C/Users/eason/Documents/GitHub/SmartWerewolf/contracts/Curve.sol",
          "file": "./Curve.sol",
          "id": 817,
          "nodeType": "ImportDirective",
          "scope": 1023,
          "sourceUnit": 3,
          "src": "28:21:2",
          "symbolAliases": [],
          "unitAlias": ""
        },
        {
          "baseContracts": [],
          "contractDependencies": [],
          "contractKind": "library",
          "documentation": null,
          "fullyImplemented": true,
          "id": 1022,
          "linearizedBaseContracts": [
            1022
          ],
          "name": "Schnorr",
          "nodeType": "ContractDefinition",
          "nodes": [
            {
              "body": {
                "id": 919,
                "nodeType": "Block",
                "src": "368:394:2",
                "statements": [
                  {
                    "assignments": [
                      835
                    ],
                    "declarations": [
                      {
                        "constant": false,
                        "id": 835,
                        "name": "xG",
                        "nodeType": "VariableDeclaration",
                        "scope": 920,
                        "src": "373:23:2",
                        "stateVariable": false,
                        "storageLocation": "memory",
                        "typeDescriptions": {
                          "typeIdentifier": "t_struct$_G1Point_$21_memory_ptr",
                          "typeString": "struct Curve.G1Point memory"
                        },
                        "typeName": {
                          "contractScope": null,
                          "id": 834,
                          "name": "Curve.G1Point",
                          "nodeType": "UserDefinedTypeName",
                          "referencedDeclaration": 21,
                          "src": "373:13:2",
                          "typeDescriptions": {
                            "typeIdentifier": "t_struct$_G1Point_$21_storage_ptr",
                            "typeString": "struct Curve.G1Point storage pointer"
                          }
                        },
                        "value": null,
                        "visibility": "internal"
                      }
                    ],
                    "id": 847,
                    "initialValue": {
                      "argumentTypes": null,
                      "arguments": [
                        {
                          "argumentTypes": null,
                          "arguments": [],
                          "expression": {
                            "argumentTypes": [],
                            "expression": {
                              "argumentTypes": null,
                              "id": 838,
                              "name": "Curve",
                              "nodeType": "Identifier",
                              "overloadedDeclarations": [],
                              "referencedDeclaration": 814,
                              "src": "411:5:2",
                              "typeDescriptions": {
                                "typeIdentifier": "t_type$_t_contract$_Curve_$814_$",
                                "typeString": "type(library Curve)"
                              }
                            },
                            "id": 839,
                            "isConstant": false,
                            "isLValue": false,
                            "isPure": false,
                            "lValueRequested": false,
                            "memberName": "P1",
                            "nodeType": "MemberAccess",
                            "referencedDeclaration": 65,
                            "src": "411:8:2",
                            "typeDescriptions": {
                              "typeIdentifier": "t_function_internal_pure$__$returns$_t_struct$_G1Point_$21_memory_ptr_$",
                              "typeString": "function () pure returns (struct Curve.G1Point memory)"
                            }
                          },
                          "id": 840,
                          "isConstant": false,
                          "isLValue": false,
                          "isPure": false,
                          "kind": "functionCall",
                          "lValueRequested": false,
                          "names": [],
                          "nodeType": "FunctionCall",
                          "src": "411:10:2",
                          "typeDescriptions": {
                            "typeIdentifier": "t_struct$_G1Point_$21_memory_ptr",
                            "typeString": "struct Curve.G1Point memory"
                          }
                        },
                        {
                          "argumentTypes": null,
                          "commonType": {
                            "typeIdentifier": "t_uint256",
                            "typeString": "uint256"
                          },
                          "id": 845,
                          "isConstant": false,
                          "isLValue": false,
                          "isPure": false,
                          "lValueRequested": false,
                          "leftExpression": {
                            "argumentTypes": null,
                            "id": 841,
                            "name": "secret",
                            "nodeType": "Identifier",
                            "overloadedDeclarations": [],
                            "referencedDeclaration": 819,
                            "src": "423:6:2",
                            "typeDescriptions": {
                              "typeIdentifier": "t_uint256",
                              "typeString": "uint256"
                            }
                          },
                          "nodeType": "BinaryOperation",
                          "operator": "%",
                          "rightExpression": {
                            "argumentTypes": null,
                            "arguments": [],
                            "expression": {
                              "argumentTypes": [],
                              "expression": {
                                "argumentTypes": null,
                                "id": 842,
                                "name": "Curve",
                                "nodeType": "Identifier",
                                "overloadedDeclarations": [],
                                "referencedDeclaration": 814,
                                "src": "432:5:2",
                                "typeDescriptions": {
                                  "typeIdentifier": "t_type$_t_contract$_Curve_$814_$",
                                  "typeString": "type(library Curve)"
                                }
                              },
                              "id": 843,
                              "isConstant": false,
                              "isLValue": false,
                              "isPure": false,
                              "lValueRequested": false,
                              "memberName": "N",
                              "nodeType": "MemberAccess",
                              "referencedDeclaration": 54,
                              "src": "432:7:2",
                              "typeDescriptions": {
                                "typeIdentifier": "t_function_internal_pure$__$returns$_t_uint256_$",
                                "typeString": "function () pure returns (uint256)"
                              }
                            },
                            "id": 844,
                            "isConstant": false,
                            "isLValue": false,
                            "isPure": false,
                            "kind": "functionCall",
                            "lValueRequested": false,
                            "names": [],
                            "nodeType": "FunctionCall",
                            "src": "432:9:2",
                            "typeDescriptions": {
                              "typeIdentifier": "t_uint256",
                              "typeString": "uint256"
                            }
                          },
                          "src": "423:18:2",
                          "typeDescriptions": {
                            "typeIdentifier": "t_uint256",
                            "typeString": "uint256"
                          }
                        }
                      ],
                      "expression": {
                        "argumentTypes": [
                          {
                            "typeIdentifier": "t_struct$_G1Point_$21_memory_ptr",
                            "typeString": "struct Curve.G1Point memory"
                          },
                          {
                            "typeIdentifier": "t_uint256",
                            "typeString": "uint256"
                          }
                        ],
                        "expression": {
                          "argumentTypes": null,
                          "id": 836,
                          "name": "Curve",
                          "nodeType": "Identifier",
                          "overloadedDeclarations": [],
                          "referencedDeclaration": 814,
                          "src": "399:5:2",
                          "typeDescriptions": {
                            "typeIdentifier": "t_type$_t_contract$_Curve_$814_$",
                            "typeString": "type(library Curve)"
                          }
                        },
                        "id": 837,
                        "isConstant": false,
                        "isLValue": false,
                        "isPure": false,
                        "lValueRequested": false,
                        "memberName": "g1mul",
                        "nodeType": "MemberAccess",
                        "referencedDeclaration": 417,
                        "src": "399:11:2",
                        "typeDescriptions": {
                          "typeIdentifier": "t_function_internal_view$_t_struct$_G1Point_$21_memory_ptr_$_t_uint256_$returns$_t_struct$_G1Point_$21_memory_ptr_$",
                          "typeString": "function (struct Curve.G1Point memory,uint256) view returns (struct Curve.G1Point memory)"
                        }
                      },
                      "id": 846,
                      "isConstant": false,
                      "isLValue": false,
                      "isPure": false,
                      "kind": "functionCall",
                      "lValueRequested": false,
                      "names": [],
                      "nodeType": "FunctionCall",
                      "src": "399:43:2",
                      "typeDescriptions": {
                        "typeIdentifier": "t_struct$_G1Point_$21_memory_ptr",
                        "typeString": "struct Curve.G1Point memory"
                      }
                    },
                    "nodeType": "VariableDeclarationStatement",
                    "src": "373:69:2"
                  },
                  {
                    "expression": {
                      "argumentTypes": null,
                      "id": 853,
                      "isConstant": false,
                      "isLValue": false,
                      "isPure": false,
                      "lValueRequested": false,
                      "leftHandSide": {
                        "argumentTypes": null,
                        "baseExpression": {
                          "argumentTypes": null,
                          "id": 848,
                          "name": "out_pubkey",
                          "nodeType": "Identifier",
                          "overloadedDeclarations": [],
                          "referencedDeclaration": 826,
                          "src": "447:10:2",
                          "typeDescriptions": {
                            "typeIdentifier": "t_array$_t_uint256_$2_memory_ptr",
                            "typeString": "uint256[2] memory"
                          }
                        },
                        "id": 850,
                        "indexExpression": {
                          "argumentTypes": null,
                          "hexValue": "30",
                          "id": 849,
                          "isConstant": false,
                          "isLValue": false,
                          "isPure": true,
                          "kind": "number",
                          "lValueRequested": false,
                          "nodeType": "Literal",
                          "src": "458:1:2",
                          "subdenomination": null,
                          "typeDescriptions": {
                            "typeIdentifier": "t_rational_0_by_1",
                            "typeString": "int_const 0"
                          },
                          "value": "0"
                        },
                        "isConstant": false,
                        "isLValue": true,
                        "isPure": false,
                        "lValueRequested": true,
                        "nodeType": "IndexAccess",
                        "src": "447:13:2",
                        "typeDescriptions": {
                          "typeIdentifier": "t_uint256",
                          "typeString": "uint256"
                        }
                      },
                      "nodeType": "Assignment",
                      "operator": "=",
                      "rightHandSide": {
                        "argumentTypes": null,
                        "expression": {
                          "argumentTypes": null,
                          "id": 851,
                          "name": "xG",
                          "nodeType": "Identifier",
                          "overloadedDeclarations": [],
                          "referencedDeclaration": 835,
                          "src": "463:2:2",
                          "typeDescriptions": {
                            "typeIdentifier": "t_struct$_G1Point_$21_memory_ptr",
                            "typeString": "struct Curve.G1Point memory"
                          }
                        },
                        "id": 852,
                        "isConstant": false,
                        "isLValue": true,
                        "isPure": false,
                        "lValueRequested": false,
                        "memberName": "X",
                        "nodeType": "MemberAccess",
                        "referencedDeclaration": 18,
                        "src": "463:4:2",
                        "typeDescriptions": {
                          "typeIdentifier": "t_uint256",
                          "typeString": "uint256"
                        }
                      },
                      "src": "447:20:2",
                      "typeDescriptions": {
                        "typeIdentifier": "t_uint256",
                        "typeString": "uint256"
                      }
                    },
                    "id": 854,
                    "nodeType": "ExpressionStatement",
                    "src": "447:20:2"
                  },
                  {
                    "expression": {
                      "argumentTypes": null,
                      "id": 860,
                      "isConstant": false,
                      "isLValue": false,
                      "isPure": false,
                      "lValueRequested": false,
                      "leftHandSide": {
                        "argumentTypes": null,
                        "baseExpression": {
                          "argumentTypes": null,
                          "id": 855,
                          "name": "out_pubkey",
                          "nodeType": "Identifier",
                          "overloadedDeclarations": [],
                          "referencedDeclaration": 826,
                          "src": "472:10:2",
                          "typeDescriptions": {
                            "typeIdentifier": "t_array$_t_uint256_$2_memory_ptr",
                            "typeString": "uint256[2] memory"
                          }
                        },
                        "id": 857,
                        "indexExpression": {
                          "argumentTypes": null,
                          "hexValue": "31",
                          "id": 856,
                          "isConstant": false,
                          "isLValue": false,
                          "isPure": true,
                          "kind": "number",
                          "lValueRequested": false,
                          "nodeType": "Literal",
                          "src": "483:1:2",
                          "subdenomination": null,
                          "typeDescriptions": {
                            "typeIdentifier": "t_rational_1_by_1",
                            "typeString": "int_const 1"
                          },
                          "value": "1"
                        },
                        "isConstant": false,
                        "isLValue": true,
                        "isPure": false,
                        "lValueRequested": true,
                        "nodeType": "IndexAccess",
                        "src": "472:13:2",
                        "typeDescriptions": {
                          "typeIdentifier": "t_uint256",
                          "typeString": "uint256"
                        }
                      },
                      "nodeType": "Assignment",
                      "operator": "=",
                      "rightHandSide": {
                        "argumentTypes": null,
                        "expression": {
                          "argumentTypes": null,
                          "id": 858,
                          "name": "xG",
                          "nodeType": "Identifier",
                          "overloadedDeclarations": [],
                          "referencedDeclaration": 835,
                          "src": "488:2:2",
                          "typeDescriptions": {
                            "typeIdentifier": "t_struct$_G1Point_$21_memory_ptr",
                            "typeString": "struct Curve.G1Point memory"
                          }
                        },
                        "id": 859,
                        "isConstant": false,
                        "isLValue": true,
                        "isPure": false,
                        "lValueRequested": false,
                        "memberName": "Y",
                        "nodeType": "MemberAccess",
                        "referencedDeclaration": 20,
                        "src": "488:4:2",
                        "typeDescriptions": {
                          "typeIdentifier": "t_uint256",
                          "typeString": "uint256"
                        }
                      },
                      "src": "472:20:2",
                      "typeDescriptions": {
                        "typeIdentifier": "t_uint256",
                        "typeString": "uint256"
                      }
                    },
                    "id": 861,
                    "nodeType": "ExpressionStatement",
                    "src": "472:20:2"
                  },
                  {
                    "assignments": [
                      863
                    ],
                    "declarations": [
                      {
                        "constant": false,
                        "id": 863,
                        "name": "k",
                        "nodeType": "VariableDeclaration",
                        "scope": 920,
                        "src": "497:9:2",
                        "stateVariable": false,
                        "storageLocation": "default",
                        "typeDescriptions": {
                          "typeIdentifier": "t_uint256",
                          "typeString": "uint256"
                        },
                        "typeName": {
                          "id": 862,
                          "name": "uint256",
                          "nodeType": "ElementaryTypeName",
                          "src": "497:7:2",
                          "typeDescriptions": {
                            "typeIdentifier": "t_uint256",
                            "typeString": "uint256"
                          }
                        },
                        "value": null,
                        "visibility": "internal"
                      }
                    ],
                    "id": 874,
                    "initialValue": {
                      "argumentTypes": null,
                      "commonType": {
                        "typeIdentifier": "t_uint256",
                        "typeString": "uint256"
                      },
                      "id": 873,
                      "isConstant": false,
                      "isLValue": false,
                      "isPure": false,
                      "lValueRequested": false,
                      "leftExpression": {
                        "argumentTypes": null,
                        "arguments": [
                          {
                            "argumentTypes": null,
                            "arguments": [
                              {
                                "argumentTypes": null,
                                "id": 866,
                                "name": "message",
                                "nodeType": "Identifier",
                                "overloadedDeclarations": [],
                                "referencedDeclaration": 821,
                                "src": "527:7:2",
                                "typeDescriptions": {
                                  "typeIdentifier": "t_uint256",
                                  "typeString": "uint256"
                                }
                              },
                              {
                                "argumentTypes": null,
                                "id": 867,
                                "name": "secret",
                                "nodeType": "Identifier",
                                "overloadedDeclarations": [],
                                "referencedDeclaration": 819,
                                "src": "536:6:2",
                                "typeDescriptions": {
                                  "typeIdentifier": "t_uint256",
                                  "typeString": "uint256"
                                }
                              }
                            ],
                            "expression": {
                              "argumentTypes": [
                                {
                                  "typeIdentifier": "t_uint256",
                                  "typeString": "uint256"
                                },
                                {
                                  "typeIdentifier": "t_uint256",
                                  "typeString": "uint256"
                                }
                              ],
                              "id": 865,
                              "name": "keccak256",
                              "nodeType": "Identifier",
                              "overloadedDeclarations": [],
                              "referencedDeclaration": 1028,
                              "src": "517:9:2",
                              "typeDescriptions": {
                                "typeIdentifier": "t_function_sha3_pure$__$returns$_t_bytes32_$",
                                "typeString": "function () pure returns (bytes32)"
                              }
                            },
                            "id": 868,
                            "isConstant": false,
                            "isLValue": false,
                            "isPure": false,
                            "kind": "functionCall",
                            "lValueRequested": false,
                            "names": [],
                            "nodeType": "FunctionCall",
                            "src": "517:26:2",
                            "typeDescriptions": {
                              "typeIdentifier": "t_bytes32",
                              "typeString": "bytes32"
                            }
                          }
                        ],
                        "expression": {
                          "argumentTypes": [
                            {
                              "typeIdentifier": "t_bytes32",
                              "typeString": "bytes32"
                            }
                          ],
                          "id": 864,
                          "isConstant": false,
                          "isLValue": false,
                          "isPure": true,
                          "lValueRequested": false,
                          "nodeType": "ElementaryTypeNameExpression",
                          "src": "509:7:2",
                          "typeDescriptions": {
                            "typeIdentifier": "t_type$_t_uint256_$",
                            "typeString": "type(uint256)"
                          },
                          "typeName": "uint256"
                        },
                        "id": 869,
                        "isConstant": false,
                        "isLValue": false,
                        "isPure": false,
                        "kind": "typeConversion",
                        "lValueRequested": false,
                        "names": [],
                        "nodeType": "FunctionCall",
                        "src": "509:35:2",
                        "typeDescriptions": {
                          "typeIdentifier": "t_uint256",
                          "typeString": "uint256"
                        }
                      },
                      "nodeType": "BinaryOperation",
                      "operator": "%",
                      "rightExpression": {
                        "argumentTypes": null,
                        "arguments": [],
                        "expression": {
                          "argumentTypes": [],
                          "expression": {
                            "argumentTypes": null,
                            "id": 870,
                            "name": "Curve",
                            "nodeType": "Identifier",
                            "overloadedDeclarations": [],
                            "referencedDeclaration": 814,
                            "src": "547:5:2",
                            "typeDescriptions": {
                              "typeIdentifier": "t_type$_t_contract$_Curve_$814_$",
                              "typeString": "type(library Curve)"
                            }
                          },
                          "id": 871,
                          "isConstant": false,
                          "isLValue": false,
                          "isPure": false,
                          "lValueRequested": false,
                          "memberName": "N",
                          "nodeType": "MemberAccess",
                          "referencedDeclaration": 54,
                          "src": "547:7:2",
                          "typeDescriptions": {
                            "typeIdentifier": "t_function_internal_pure$__$returns$_t_uint256_$",
                            "typeString": "function () pure returns (uint256)"
                          }
                        },
                        "id": 872,
                        "isConstant": false,
                        "isLValue": false,
                        "isPure": false,
                        "kind": "functionCall",
                        "lValueRequested": false,
                        "names": [],
                        "nodeType": "FunctionCall",
                        "src": "547:9:2",
                        "typeDescriptions": {
                          "typeIdentifier": "t_uint256",
                          "typeString": "uint256"
                        }
                      },
                      "src": "509:47:2",
                      "typeDescriptions": {
                        "typeIdentifier": "t_uint256",
                        "typeString": "uint256"
                      }
                    },
                    "nodeType": "VariableDeclarationStatement",
                    "src": "497:59:2"
                  },
                  {
                    "assignments": [
                      878
                    ],
                    "declarations": [
                      {
                        "constant": false,
                        "id": 878,
                        "name": "kG",
                        "nodeType": "VariableDeclaration",
                        "scope": 920,
                        "src": "561:23:2",
                        "stateVariable": false,
                        "storageLocation": "memory",
                        "typeDescriptions": {
                          "typeIdentifier": "t_struct$_G1Point_$21_memory_ptr",
                          "typeString": "struct Curve.G1Point memory"
                        },
                        "typeName": {
                          "contractScope": null,
                          "id": 877,
                          "name": "Curve.G1Point",
                          "nodeType": "UserDefinedTypeName",
                          "referencedDeclaration": 21,
                          "src": "561:13:2",
                          "typeDescriptions": {
                            "typeIdentifier": "t_struct$_G1Point_$21_storage_ptr",
                            "typeString": "struct Curve.G1Point storage pointer"
                          }
                        },
                        "value": null,
                        "visibility": "internal"
                      }
                    ],
                    "id": 886,
                    "initialValue": {
                      "argumentTypes": null,
                      "arguments": [
                        {
                          "argumentTypes": null,
                          "arguments": [],
                          "expression": {
                            "argumentTypes": [],
                            "expression": {
                              "argumentTypes": null,
                              "id": 881,
                              "name": "Curve",
                              "nodeType": "Identifier",
                              "overloadedDeclarations": [],
                              "referencedDeclaration": 814,
                              "src": "599:5:2",
                              "typeDescriptions": {
                                "typeIdentifier": "t_type$_t_contract$_Curve_$814_$",
                                "typeString": "type(library Curve)"
                              }
                            },
                            "id": 882,
                            "isConstant": false,
                            "isLValue": false,
                            "isPure": false,
                            "lValueRequested": false,
                            "memberName": "P1",
                            "nodeType": "MemberAccess",
                            "referencedDeclaration": 65,
                            "src": "599:8:2",
                            "typeDescriptions": {
                              "typeIdentifier": "t_function_internal_pure$__$returns$_t_struct$_G1Point_$21_memory_ptr_$",
                              "typeString": "function () pure returns (struct Curve.G1Point memory)"
                            }
                          },
                          "id": 883,
                          "isConstant": false,
                          "isLValue": false,
                          "isPure": false,
                          "kind": "functionCall",
                          "lValueRequested": false,
                          "names": [],
                          "nodeType": "FunctionCall",
                          "src": "599:10:2",
                          "typeDescriptions": {
                            "typeIdentifier": "t_struct$_G1Point_$21_memory_ptr",
                            "typeString": "struct Curve.G1Point memory"
                          }
                        },
                        {
                          "argumentTypes": null,
                          "id": 884,
                          "name": "k",
                          "nodeType": "Identifier",
                          "overloadedDeclarations": [],
                          "referencedDeclaration": 863,
                          "src": "611:1:2",
                          "typeDescriptions": {
                            "typeIdentifier": "t_uint256",
                            "typeString": "uint256"
                          }
                        }
                      ],
                      "expression": {
                        "argumentTypes": [
                          {
                            "typeIdentifier": "t_struct$_G1Point_$21_memory_ptr",
                            "typeString": "struct Curve.G1Point memory"
                          },
                          {
                            "typeIdentifier": "t_uint256",
                            "typeString": "uint256"
                          }
                        ],
                        "expression": {
                          "argumentTypes": null,
                          "id": 879,
                          "name": "Curve",
                          "nodeType": "Identifier",
                          "overloadedDeclarations": [],
                          "referencedDeclaration": 814,
                          "src": "587:5:2",
                          "typeDescriptions": {
                            "typeIdentifier": "t_type$_t_contract$_Curve_$814_$",
                            "typeString": "type(library Curve)"
                          }
                        },
                        "id": 880,
                        "isConstant": false,
                        "isLValue": false,
                        "isPure": false,
                        "lValueRequested": false,
                        "memberName": "g1mul",
                        "nodeType": "MemberAccess",
                        "referencedDeclaration": 417,
                        "src": "587:11:2",
                        "typeDescriptions": {
                          "typeIdentifier": "t_function_internal_view$_t_struct$_G1Point_$21_memory_ptr_$_t_uint256_$returns$_t_struct$_G1Point_$21_memory_ptr_$",
                          "typeString": "function (struct Curve.G1Point memory,uint256) view returns (struct Curve.G1Point memory)"
                        }
                      },
                      "id": 885,
                      "isConstant": false,
                      "isLValue": false,
                      "isPure": false,
                      "kind": "functionCall",
                      "lValueRequested": false,
                      "names": [],
                      "nodeType": "FunctionCall",
                      "src": "587:26:2",
                      "typeDescriptions": {
                        "typeIdentifier": "t_struct$_G1Point_$21_memory_ptr",
                        "typeString": "struct Curve.G1Point memory"
                      }
                    },
                    "nodeType": "VariableDeclarationStatement",
                    "src": "561:52:2"
                  },
                  {
                    "expression": {
                      "argumentTypes": null,
                      "id": 903,
                      "isConstant": false,
                      "isLValue": false,
                      "isPure": false,
                      "lValueRequested": false,
                      "leftHandSide": {
                        "argumentTypes": null,
                        "id": 887,
                        "name": "out_e",
                        "nodeType": "Identifier",
                        "overloadedDeclarations": [],
                        "referencedDeclaration": 830,
                        "src": "618:5:2",
                        "typeDescriptions": {
                          "typeIdentifier": "t_uint256",
                          "typeString": "uint256"
                        }
                      },
                      "nodeType": "Assignment",
                      "operator": "=",
                      "rightHandSide": {
                        "argumentTypes": null,
                        "arguments": [
                          {
                            "argumentTypes": null,
                            "arguments": [
                              {
                                "argumentTypes": null,
                                "baseExpression": {
                                  "argumentTypes": null,
                                  "id": 890,
                                  "name": "out_pubkey",
                                  "nodeType": "Identifier",
                                  "overloadedDeclarations": [],
                                  "referencedDeclaration": 826,
                                  "src": "644:10:2",
                                  "typeDescriptions": {
                                    "typeIdentifier": "t_array$_t_uint256_$2_memory_ptr",
                                    "typeString": "uint256[2] memory"
                                  }
                                },
                                "id": 892,
                                "indexExpression": {
                                  "argumentTypes": null,
                                  "hexValue": "30",
                                  "id": 891,
                                  "isConstant": false,
                                  "isLValue": false,
                                  "isPure": true,
                                  "kind": "number",
                                  "lValueRequested": false,
                                  "nodeType": "Literal",
                                  "src": "655:1:2",
                                  "subdenomination": null,
                                  "typeDescriptions": {
                                    "typeIdentifier": "t_rational_0_by_1",
                                    "typeString": "int_const 0"
                                  },
                                  "value": "0"
                                },
                                "isConstant": false,
                                "isLValue": true,
                                "isPure": false,
                                "lValueRequested": false,
                                "nodeType": "IndexAccess",
                                "src": "644:13:2",
                                "typeDescriptions": {
                                  "typeIdentifier": "t_uint256",
                                  "typeString": "uint256"
                                }
                              },
                              {
                                "argumentTypes": null,
                                "baseExpression": {
                                  "argumentTypes": null,
                                  "id": 893,
                                  "name": "out_pubkey",
                                  "nodeType": "Identifier",
                                  "overloadedDeclarations": [],
                                  "referencedDeclaration": 826,
                                  "src": "659:10:2",
                                  "typeDescriptions": {
                                    "typeIdentifier": "t_array$_t_uint256_$2_memory_ptr",
                                    "typeString": "uint256[2] memory"
                                  }
                                },
                                "id": 895,
                                "indexExpression": {
                                  "argumentTypes": null,
                                  "hexValue": "31",
                                  "id": 894,
                                  "isConstant": false,
                                  "isLValue": false,
                                  "isPure": true,
                                  "kind": "number",
                                  "lValueRequested": false,
                                  "nodeType": "Literal",
                                  "src": "670:1:2",
                                  "subdenomination": null,
                                  "typeDescriptions": {
                                    "typeIdentifier": "t_rational_1_by_1",
                                    "typeString": "int_const 1"
                                  },
                                  "value": "1"
                                },
                                "isConstant": false,
                                "isLValue": true,
                                "isPure": false,
                                "lValueRequested": false,
                                "nodeType": "IndexAccess",
                                "src": "659:13:2",
                                "typeDescriptions": {
                                  "typeIdentifier": "t_uint256",
                                  "typeString": "uint256"
                                }
                              },
                              {
                                "argumentTypes": null,
                                "expression": {
                                  "argumentTypes": null,
                                  "id": 896,
                                  "name": "kG",
                                  "nodeType": "Identifier",
                                  "overloadedDeclarations": [],
                                  "referencedDeclaration": 878,
                                  "src": "674:2:2",
                                  "typeDescriptions": {
                                    "typeIdentifier": "t_struct$_G1Point_$21_memory_ptr",
                                    "typeString": "struct Curve.G1Point memory"
                                  }
                                },
                                "id": 897,
                                "isConstant": false,
                                "isLValue": true,
                                "isPure": false,
                                "lValueRequested": false,
                                "memberName": "X",
                                "nodeType": "MemberAccess",
                                "referencedDeclaration": 18,
                                "src": "674:4:2",
                                "typeDescriptions": {
                                  "typeIdentifier": "t_uint256",
                                  "typeString": "uint256"
                                }
                              },
                              {
                                "argumentTypes": null,
                                "expression": {
                                  "argumentTypes": null,
                                  "id": 898,
                                  "name": "kG",
                                  "nodeType": "Identifier",
                                  "overloadedDeclarations": [],
                                  "referencedDeclaration": 878,
                                  "src": "680:2:2",
                                  "typeDescriptions": {
                                    "typeIdentifier": "t_struct$_G1Point_$21_memory_ptr",
                                    "typeString": "struct Curve.G1Point memory"
                                  }
                                },
                                "id": 899,
                                "isConstant": false,
                                "isLValue": true,
                                "isPure": false,
                                "lValueRequested": false,
                                "memberName": "Y",
                                "nodeType": "MemberAccess",
                                "referencedDeclaration": 20,
                                "src": "680:4:2",
                                "typeDescriptions": {
                                  "typeIdentifier": "t_uint256",
                                  "typeString": "uint256"
                                }
                              },
                              {
                                "argumentTypes": null,
                                "id": 900,
                                "name": "message",
                                "nodeType": "Identifier",
                                "overloadedDeclarations": [],
                                "referencedDeclaration": 821,
                                "src": "686:7:2",
                                "typeDescriptions": {
                                  "typeIdentifier": "t_uint256",
                                  "typeString": "uint256"
                                }
                              }
                            ],
                            "expression": {
                              "argumentTypes": [
                                {
                                  "typeIdentifier": "t_uint256",
                                  "typeString": "uint256"
                                },
                                {
                                  "typeIdentifier": "t_uint256",
                                  "typeString": "uint256"
                                },
                                {
                                  "typeIdentifier": "t_uint256",
                                  "typeString": "uint256"
                                },
                                {
                                  "typeIdentifier": "t_uint256",
                                  "typeString": "uint256"
                                },
                                {
                                  "typeIdentifier": "t_uint256",
                                  "typeString": "uint256"
                                }
                              ],
                              "id": 889,
                              "name": "keccak256",
                              "nodeType": "Identifier",
                              "overloadedDeclarations": [],
                              "referencedDeclaration": 1028,
                              "src": "634:9:2",
                              "typeDescriptions": {
                                "typeIdentifier": "t_function_sha3_pure$__$returns$_t_bytes32_$",
                                "typeString": "function () pure returns (bytes32)"
                              }
                            },
                            "id": 901,
                            "isConstant": false,
                            "isLValue": false,
                            "isPure": false,
                            "kind": "functionCall",
                            "lValueRequested": false,
                            "names": [],
                            "nodeType": "FunctionCall",
                            "src": "634:60:2",
                            "typeDescriptions": {
                              "typeIdentifier": "t_bytes32",
                              "typeString": "bytes32"
                            }
                          }
                        ],
                        "expression": {
                          "argumentTypes": [
                            {
                              "typeIdentifier": "t_bytes32",
                              "typeString": "bytes32"
                            }
                          ],
                          "id": 888,
                          "isConstant": false,
                          "isLValue": false,
                          "isPure": true,
                          "lValueRequested": false,
                          "nodeType": "ElementaryTypeNameExpression",
                          "src": "626:7:2",
                          "typeDescriptions": {
                            "typeIdentifier": "t_type$_t_uint256_$",
                            "typeString": "type(uint256)"
                          },
                          "typeName": "uint256"
                        },
                        "id": 902,
                        "isConstant": false,
                        "isLValue": false,
                        "isPure": false,
                        "kind": "typeConversion",
                        "lValueRequested": false,
                        "names": [],
                        "nodeType": "FunctionCall",
                        "src": "626:69:2",
                        "typeDescriptions": {
                          "typeIdentifier": "t_uint256",
                          "typeString": "uint256"
                        }
                      },
                      "src": "618:77:2",
                      "typeDescriptions": {
                        "typeIdentifier": "t_uint256",
                        "typeString": "uint256"
                      }
                    },
                    "id": 904,
                    "nodeType": "ExpressionStatement",
                    "src": "618:77:2"
                  },
                  {
                    "expression": {
                      "argumentTypes": null,
                      "id": 917,
                      "isConstant": false,
                      "isLValue": false,
                      "isPure": false,
                      "lValueRequested": false,
                      "leftHandSide": {
                        "argumentTypes": null,
                        "id": 905,
                        "name": "out_s",
                        "nodeType": "Identifier",
                        "overloadedDeclarations": [],
                        "referencedDeclaration": 828,
                        "src": "700:5:2",
                        "typeDescriptions": {
                          "typeIdentifier": "t_uint256",
                          "typeString": "uint256"
                        }
                      },
                      "nodeType": "Assignment",
                      "operator": "=",
                      "rightHandSide": {
                        "argumentTypes": null,
                        "arguments": [
                          {
                            "argumentTypes": null,
                            "id": 908,
                            "name": "k",
                            "nodeType": "Identifier",
                            "overloadedDeclarations": [],
                            "referencedDeclaration": 863,
                            "src": "721:1:2",
                            "typeDescriptions": {
                              "typeIdentifier": "t_uint256",
                              "typeString": "uint256"
                            }
                          },
                          {
                            "argumentTypes": null,
                            "arguments": [
                              {
                                "argumentTypes": null,
                                "id": 910,
                                "name": "secret",
                                "nodeType": "Identifier",
                                "overloadedDeclarations": [],
                                "referencedDeclaration": 819,
                                "src": "731:6:2",
                                "typeDescriptions": {
                                  "typeIdentifier": "t_uint256",
                                  "typeString": "uint256"
                                }
                              },
                              {
                                "argumentTypes": null,
                                "id": 911,
                                "name": "out_e",
                                "nodeType": "Identifier",
                                "overloadedDeclarations": [],
                                "referencedDeclaration": 830,
                                "src": "739:5:2",
                                "typeDescriptions": {
                                  "typeIdentifier": "t_uint256",
                                  "typeString": "uint256"
                                }
                              },
                              {
                                "argumentTypes": null,
                                "arguments": [],
                                "expression": {
                                  "argumentTypes": [],
                                  "expression": {
                                    "argumentTypes": null,
                                    "id": 912,
                                    "name": "Curve",
                                    "nodeType": "Identifier",
                                    "overloadedDeclarations": [],
                                    "referencedDeclaration": 814,
                                    "src": "746:5:2",
                                    "typeDescriptions": {
                                      "typeIdentifier": "t_type$_t_contract$_Curve_$814_$",
                                      "typeString": "type(library Curve)"
                                    }
                                  },
                                  "id": 913,
                                  "isConstant": false,
                                  "isLValue": false,
                                  "isPure": false,
                                  "lValueRequested": false,
                                  "memberName": "N",
                                  "nodeType": "MemberAccess",
                                  "referencedDeclaration": 54,
                                  "src": "746:7:2",
                                  "typeDescriptions": {
                                    "typeIdentifier": "t_function_internal_pure$__$returns$_t_uint256_$",
                                    "typeString": "function () pure returns (uint256)"
                                  }
                                },
                                "id": 914,
                                "isConstant": false,
                                "isLValue": false,
                                "isPure": false,
                                "kind": "functionCall",
                                "lValueRequested": false,
                                "names": [],
                                "nodeType": "FunctionCall",
                                "src": "746:9:2",
                                "typeDescriptions": {
                                  "typeIdentifier": "t_uint256",
                                  "typeString": "uint256"
                                }
                              }
                            ],
                            "expression": {
                              "argumentTypes": [
                                {
                                  "typeIdentifier": "t_uint256",
                                  "typeString": "uint256"
                                },
                                {
                                  "typeIdentifier": "t_uint256",
                                  "typeString": "uint256"
                                },
                                {
                                  "typeIdentifier": "t_uint256",
                                  "typeString": "uint256"
                                }
                              ],
                              "id": 909,
                              "name": "mulmod",
                              "nodeType": "Identifier",
                              "overloadedDeclarations": [],
                              "referencedDeclaration": 1035,
                              "src": "724:6:2",
                              "typeDescriptions": {
                                "typeIdentifier": "t_function_mulmod_pure$_t_uint256_$_t_uint256_$_t_uint256_$returns$_t_uint256_$",
                                "typeString": "function (uint256,uint256,uint256) pure returns (uint256)"
                              }
                            },
                            "id": 915,
                            "isConstant": false,
                            "isLValue": false,
                            "isPure": false,
                            "kind": "functionCall",
                            "lValueRequested": false,
                            "names": [],
                            "nodeType": "FunctionCall",
                            "src": "724:32:2",
                            "typeDescriptions": {
                              "typeIdentifier": "t_uint256",
                              "typeString": "uint256"
                            }
                          }
                        ],
                        "expression": {
                          "argumentTypes": [
                            {
                              "typeIdentifier": "t_uint256",
                              "typeString": "uint256"
                            },
                            {
                              "typeIdentifier": "t_uint256",
                              "typeString": "uint256"
                            }
                          ],
                          "expression": {
                            "argumentTypes": null,
                            "id": 906,
                            "name": "Curve",
                            "nodeType": "Identifier",
                            "overloadedDeclarations": [],
                            "referencedDeclaration": 814,
                            "src": "708:5:2",
                            "typeDescriptions": {
                              "typeIdentifier": "t_type$_t_contract$_Curve_$814_$",
                              "typeString": "type(library Curve)"
                            }
                          },
                          "id": 907,
                          "isConstant": false,
                          "isLValue": false,
                          "isPure": false,
                          "lValueRequested": false,
                          "memberName": "submod",
                          "nodeType": "MemberAccess",
                          "referencedDeclaration": 195,
                          "src": "708:12:2",
                          "typeDescriptions": {
                            "typeIdentifier": "t_function_internal_pure$_t_uint256_$_t_uint256_$returns$_t_uint256_$",
                            "typeString": "function (uint256,uint256) pure returns (uint256)"
                          }
                        },
                        "id": 916,
                        "isConstant": false,
                        "isLValue": false,
                        "isPure": false,
                        "kind": "functionCall",
                        "lValueRequested": false,
                        "names": [],
                        "nodeType": "FunctionCall",
                        "src": "708:49:2",
                        "typeDescriptions": {
                          "typeIdentifier": "t_uint256",
                          "typeString": "uint256"
                        }
                      },
                      "src": "700:57:2",
                      "typeDescriptions": {
                        "typeIdentifier": "t_uint256",
                        "typeString": "uint256"
                      }
                    },
                    "id": 918,
                    "nodeType": "ExpressionStatement",
                    "src": "700:57:2"
                  }
                ]
              },
              "id": 920,
              "implemented": true,
              "isConstructor": false,
              "isDeclaredConst": true,
              "modifiers": [],
              "name": "CreateProof",
              "nodeType": "FunctionDefinition",
              "parameters": {
                "id": 822,
                "nodeType": "ParameterList",
                "parameters": [
                  {
                    "constant": false,
                    "id": 819,
                    "name": "secret",
                    "nodeType": "VariableDeclaration",
                    "scope": 920,
                    "src": "240:14:2",
                    "stateVariable": false,
                    "storageLocation": "default",
                    "typeDescriptions": {
                      "typeIdentifier": "t_uint256",
                      "typeString": "uint256"
                    },
                    "typeName": {
                      "id": 818,
                      "name": "uint256",
                      "nodeType": "ElementaryTypeName",
                      "src": "240:7:2",
                      "typeDescriptions": {
                        "typeIdentifier": "t_uint256",
                        "typeString": "uint256"
                      }
                    },
                    "value": null,
                    "visibility": "internal"
                  },
                  {
                    "constant": false,
                    "id": 821,
                    "name": "message",
                    "nodeType": "VariableDeclaration",
                    "scope": 920,
                    "src": "256:15:2",
                    "stateVariable": false,
                    "storageLocation": "default",
                    "typeDescriptions": {
                      "typeIdentifier": "t_uint256",
                      "typeString": "uint256"
                    },
                    "typeName": {
                      "id": 820,
                      "name": "uint256",
                      "nodeType": "ElementaryTypeName",
                      "src": "256:7:2",
                      "typeDescriptions": {
                        "typeIdentifier": "t_uint256",
                        "typeString": "uint256"
                      }
                    },
                    "value": null,
                    "visibility": "internal"
                  }
                ],
                "src": "238:35:2"
              },
              "payable": false,
              "returnParameters": {
                "id": 831,
                "nodeType": "ParameterList",
                "parameters": [
                  {
                    "constant": false,
                    "id": 826,
                    "name": "out_pubkey",
                    "nodeType": "VariableDeclaration",
                    "scope": 920,
                    "src": "313:21:2",
                    "stateVariable": false,
                    "storageLocation": "default",
                    "typeDescriptions": {
                      "typeIdentifier": "t_array$_t_uint256_$2_memory_ptr",
                      "typeString": "uint256[2] memory"
                    },
                    "typeName": {
                      "baseType": {
                        "id": 823,
                        "name": "uint256",
                        "nodeType": "ElementaryTypeName",
                        "src": "313:7:2",
                        "typeDescriptions": {
                          "typeIdentifier": "t_uint256",
                          "typeString": "uint256"
                        }
                      },
                      "id": 825,
                      "length": {
                        "argumentTypes": null,
                        "hexValue": "32",
                        "id": 824,
                        "isConstant": false,
                        "isLValue": false,
                        "isPure": false,
                        "kind": "number",
                        "lValueRequested": false,
                        "nodeType": "Literal",
                        "src": "321:1:2",
                        "subdenomination": null,
                        "typeDescriptions": {
                          "typeIdentifier": "t_rational_2_by_1",
                          "typeString": "int_const 2"
                        },
                        "value": "2"
                      },
                      "nodeType": "ArrayTypeName",
                      "src": "313:10:2",
                      "typeDescriptions": {
                        "typeIdentifier": "t_array$_t_uint256_$2_storage_ptr",
                        "typeString": "uint256[2] storage pointer"
                      }
                    },
                    "value": null,
                    "visibility": "internal"
                  },
                  {
                    "constant": false,
                    "id": 828,
                    "name": "out_s",
                    "nodeType": "VariableDeclaration",
                    "scope": 920,
                    "src": "336:13:2",
                    "stateVariable": false,
                    "storageLocation": "default",
                    "typeDescriptions": {
                      "typeIdentifier": "t_uint256",
                      "typeString": "uint256"
                    },
                    "typeName": {
                      "id": 827,
                      "name": "uint256",
                      "nodeType": "ElementaryTypeName",
                      "src": "336:7:2",
                      "typeDescriptions": {
                        "typeIdentifier": "t_uint256",
                        "typeString": "uint256"
                      }
                    },
                    "value": null,
                    "visibility": "internal"
                  },
                  {
                    "constant": false,
                    "id": 830,
                    "name": "out_e",
                    "nodeType": "VariableDeclaration",
                    "scope": 920,
                    "src": "351:13:2",
                    "stateVariable": false,
                    "storageLocation": "default",
                    "typeDescriptions": {
                      "typeIdentifier": "t_uint256",
                      "typeString": "uint256"
                    },
                    "typeName": {
                      "id": 829,
                      "name": "uint256",
                      "nodeType": "ElementaryTypeName",
                      "src": "351:7:2",
                      "typeDescriptions": {
                        "typeIdentifier": "t_uint256",
                        "typeString": "uint256"
                      }
                    },
                    "value": null,
                    "visibility": "internal"
                  }
                ],
                "src": "312:53:2"
              },
              "scope": 1022,
              "src": "218:544:2",
              "stateMutability": "view",
              "superFunction": null,
              "visibility": "internal"
            },
            {
              "body": {
                "id": 995,
                "nodeType": "Block",
                "src": "957:291:2",
                "statements": [
                  {
                    "assignments": [
                      938
                    ],
                    "declarations": [
                      {
                        "constant": false,
                        "id": 938,
                        "name": "sG",
                        "nodeType": "VariableDeclaration",
                        "scope": 996,
                        "src": "965:23:2",
                        "stateVariable": false,
                        "storageLocation": "memory",
                        "typeDescriptions": {
                          "typeIdentifier": "t_struct$_G1Point_$21_memory_ptr",
                          "typeString": "struct Curve.G1Point memory"
                        },
                        "typeName": {
                          "contractScope": null,
                          "id": 937,
                          "name": "Curve.G1Point",
                          "nodeType": "UserDefinedTypeName",
                          "referencedDeclaration": 21,
                          "src": "965:13:2",
                          "typeDescriptions": {
                            "typeIdentifier": "t_struct$_G1Point_$21_storage_ptr",
                            "typeString": "struct Curve.G1Point storage pointer"
                          }
                        },
                        "value": null,
                        "visibility": "internal"
                      }
                    ],
                    "id": 950,
                    "initialValue": {
                      "argumentTypes": null,
                      "arguments": [
                        {
                          "argumentTypes": null,
                          "arguments": [],
                          "expression": {
                            "argumentTypes": [],
                            "expression": {
                              "argumentTypes": null,
                              "id": 941,
                              "name": "Curve",
                              "nodeType": "Identifier",
                              "overloadedDeclarations": [],
                              "referencedDeclaration": 814,
                              "src": "1003:5:2",
                              "typeDescriptions": {
                                "typeIdentifier": "t_type$_t_contract$_Curve_$814_$",
                                "typeString": "type(library Curve)"
                              }
                            },
                            "id": 942,
                            "isConstant": false,
                            "isLValue": false,
                            "isPure": false,
                            "lValueRequested": false,
                            "memberName": "P1",
                            "nodeType": "MemberAccess",
                            "referencedDeclaration": 65,
                            "src": "1003:8:2",
                            "typeDescriptions": {
                              "typeIdentifier": "t_function_internal_pure$__$returns$_t_struct$_G1Point_$21_memory_ptr_$",
                              "typeString": "function () pure returns (struct Curve.G1Point memory)"
                            }
                          },
                          "id": 943,
                          "isConstant": false,
                          "isLValue": false,
                          "isPure": false,
                          "kind": "functionCall",
                          "lValueRequested": false,
                          "names": [],
                          "nodeType": "FunctionCall",
                          "src": "1003:10:2",
                          "typeDescriptions": {
                            "typeIdentifier": "t_struct$_G1Point_$21_memory_ptr",
                            "typeString": "struct Curve.G1Point memory"
                          }
                        },
                        {
                          "argumentTypes": null,
                          "commonType": {
                            "typeIdentifier": "t_uint256",
                            "typeString": "uint256"
                          },
                          "id": 948,
                          "isConstant": false,
                          "isLValue": false,
                          "isPure": false,
                          "lValueRequested": false,
                          "leftExpression": {
                            "argumentTypes": null,
                            "id": 944,
                            "name": "s",
                            "nodeType": "Identifier",
                            "overloadedDeclarations": [],
                            "referencedDeclaration": 928,
                            "src": "1015:1:2",
                            "typeDescriptions": {
                              "typeIdentifier": "t_uint256",
                              "typeString": "uint256"
                            }
                          },
                          "nodeType": "BinaryOperation",
                          "operator": "%",
                          "rightExpression": {
                            "argumentTypes": null,
                            "arguments": [],
                            "expression": {
                              "argumentTypes": [],
                              "expression": {
                                "argumentTypes": null,
                                "id": 945,
                                "name": "Curve",
                                "nodeType": "Identifier",
                                "overloadedDeclarations": [],
                                "referencedDeclaration": 814,
                                "src": "1019:5:2",
                                "typeDescriptions": {
                                  "typeIdentifier": "t_type$_t_contract$_Curve_$814_$",
                                  "typeString": "type(library Curve)"
                                }
                              },
                              "id": 946,
                              "isConstant": false,
                              "isLValue": false,
                              "isPure": false,
                              "lValueRequested": false,
                              "memberName": "N",
                              "nodeType": "MemberAccess",
                              "referencedDeclaration": 54,
                              "src": "1019:7:2",
                              "typeDescriptions": {
                                "typeIdentifier": "t_function_internal_pure$__$returns$_t_uint256_$",
                                "typeString": "function () pure returns (uint256)"
                              }
                            },
                            "id": 947,
                            "isConstant": false,
                            "isLValue": false,
                            "isPure": false,
                            "kind": "functionCall",
                            "lValueRequested": false,
                            "names": [],
                            "nodeType": "FunctionCall",
                            "src": "1019:9:2",
                            "typeDescriptions": {
                              "typeIdentifier": "t_uint256",
                              "typeString": "uint256"
                            }
                          },
                          "src": "1015:13:2",
                          "typeDescriptions": {
                            "typeIdentifier": "t_uint256",
                            "typeString": "uint256"
                          }
                        }
                      ],
                      "expression": {
                        "argumentTypes": [
                          {
                            "typeIdentifier": "t_struct$_G1Point_$21_memory_ptr",
                            "typeString": "struct Curve.G1Point memory"
                          },
                          {
                            "typeIdentifier": "t_uint256",
                            "typeString": "uint256"
                          }
                        ],
                        "expression": {
                          "argumentTypes": null,
                          "id": 939,
                          "name": "Curve",
                          "nodeType": "Identifier",
                          "overloadedDeclarations": [],
                          "referencedDeclaration": 814,
                          "src": "991:5:2",
                          "typeDescriptions": {
                            "typeIdentifier": "t_type$_t_contract$_Curve_$814_$",
                            "typeString": "type(library Curve)"
                          }
                        },
                        "id": 940,
                        "isConstant": false,
                        "isLValue": false,
                        "isPure": false,
                        "lValueRequested": false,
                        "memberName": "g1mul",
                        "nodeType": "MemberAccess",
                        "referencedDeclaration": 417,
                        "src": "991:11:2",
                        "typeDescriptions": {
                          "typeIdentifier": "t_function_internal_view$_t_struct$_G1Point_$21_memory_ptr_$_t_uint256_$returns$_t_struct$_G1Point_$21_memory_ptr_$",
                          "typeString": "function (struct Curve.G1Point memory,uint256) view returns (struct Curve.G1Point memory)"
                        }
                      },
                      "id": 949,
                      "isConstant": false,
                      "isLValue": false,
                      "isPure": false,
                      "kind": "functionCall",
                      "lValueRequested": false,
                      "names": [],
                      "nodeType": "FunctionCall",
                      "src": "991:38:2",
                      "typeDescriptions": {
                        "typeIdentifier": "t_struct$_G1Point_$21_memory_ptr",
                        "typeString": "struct Curve.G1Point memory"
                      }
                    },
                    "nodeType": "VariableDeclarationStatement",
                    "src": "965:64:2"
                  },
                  {
                    "assignments": [
                      954
                    ],
                    "declarations": [
                      {
                        "constant": false,
                        "id": 954,
                        "name": "xG",
                        "nodeType": "VariableDeclaration",
                        "scope": 996,
                        "src": "1037:23:2",
                        "stateVariable": false,
                        "storageLocation": "memory",
                        "typeDescriptions": {
                          "typeIdentifier": "t_struct$_G1Point_$21_memory_ptr",
                          "typeString": "struct Curve.G1Point memory"
                        },
                        "typeName": {
                          "contractScope": null,
                          "id": 953,
                          "name": "Curve.G1Point",
                          "nodeType": "UserDefinedTypeName",
                          "referencedDeclaration": 21,
                          "src": "1037:13:2",
                          "typeDescriptions": {
                            "typeIdentifier": "t_struct$_G1Point_$21_storage_ptr",
                            "typeString": "struct Curve.G1Point storage pointer"
                          }
                        },
                        "value": null,
                        "visibility": "internal"
                      }
                    ],
                    "id": 964,
                    "initialValue": {
                      "argumentTypes": null,
                      "arguments": [
                        {
                          "argumentTypes": null,
                          "baseExpression": {
                            "argumentTypes": null,
                            "id": 957,
                            "name": "pubkey",
                            "nodeType": "Identifier",
                            "overloadedDeclarations": [],
                            "referencedDeclaration": 924,
                            "src": "1077:6:2",
                            "typeDescriptions": {
                              "typeIdentifier": "t_array$_t_uint256_$2_memory_ptr",
                              "typeString": "uint256[2] memory"
                            }
                          },
                          "id": 959,
                          "indexExpression": {
                            "argumentTypes": null,
                            "hexValue": "30",
                            "id": 958,
                            "isConstant": false,
                            "isLValue": false,
                            "isPure": true,
                            "kind": "number",
                            "lValueRequested": false,
                            "nodeType": "Literal",
                            "src": "1084:1:2",
                            "subdenomination": null,
                            "typeDescriptions": {
                              "typeIdentifier": "t_rational_0_by_1",
                              "typeString": "int_const 0"
                            },
                            "value": "0"
                          },
                          "isConstant": false,
                          "isLValue": true,
                          "isPure": false,
                          "lValueRequested": false,
                          "nodeType": "IndexAccess",
                          "src": "1077:9:2",
                          "typeDescriptions": {
                            "typeIdentifier": "t_uint256",
                            "typeString": "uint256"
                          }
                        },
                        {
                          "argumentTypes": null,
                          "baseExpression": {
                            "argumentTypes": null,
                            "id": 960,
                            "name": "pubkey",
                            "nodeType": "Identifier",
                            "overloadedDeclarations": [],
                            "referencedDeclaration": 924,
                            "src": "1088:6:2",
                            "typeDescriptions": {
                              "typeIdentifier": "t_array$_t_uint256_$2_memory_ptr",
                              "typeString": "uint256[2] memory"
                            }
                          },
                          "id": 962,
                          "indexExpression": {
                            "argumentTypes": null,
                            "hexValue": "31",
                            "id": 961,
                            "isConstant": false,
                            "isLValue": false,
                            "isPure": true,
                            "kind": "number",
                            "lValueRequested": false,
                            "nodeType": "Literal",
                            "src": "1095:1:2",
                            "subdenomination": null,
                            "typeDescriptions": {
                              "typeIdentifier": "t_rational_1_by_1",
                              "typeString": "int_const 1"
                            },
                            "value": "1"
                          },
                          "isConstant": false,
                          "isLValue": true,
                          "isPure": false,
                          "lValueRequested": false,
                          "nodeType": "IndexAccess",
                          "src": "1088:9:2",
                          "typeDescriptions": {
                            "typeIdentifier": "t_uint256",
                            "typeString": "uint256"
                          }
                        }
                      ],
                      "expression": {
                        "argumentTypes": [
                          {
                            "typeIdentifier": "t_uint256",
                            "typeString": "uint256"
                          },
                          {
                            "typeIdentifier": "t_uint256",
                            "typeString": "uint256"
                          }
                        ],
                        "expression": {
                          "argumentTypes": null,
                          "id": 955,
                          "name": "Curve",
                          "nodeType": "Identifier",
                          "overloadedDeclarations": [],
                          "referencedDeclaration": 814,
                          "src": "1063:5:2",
                          "typeDescriptions": {
                            "typeIdentifier": "t_type$_t_contract$_Curve_$814_$",
                            "typeString": "type(library Curve)"
                          }
                        },
                        "id": 956,
                        "isConstant": false,
                        "isLValue": false,
                        "isPure": false,
                        "lValueRequested": false,
                        "memberName": "G1Point",
                        "nodeType": "MemberAccess",
                        "referencedDeclaration": 21,
                        "src": "1063:13:2",
                        "typeDescriptions": {
                          "typeIdentifier": "t_type$_t_struct$_G1Point_$21_storage_ptr_$",
                          "typeString": "type(struct Curve.G1Point storage pointer)"
                        }
                      },
                      "id": 963,
                      "isConstant": false,
                      "isLValue": false,
                      "isPure": false,
                      "kind": "structConstructorCall",
                      "lValueRequested": false,
                      "names": [],
                      "nodeType": "FunctionCall",
                      "src": "1063:35:2",
                      "typeDescriptions": {
                        "typeIdentifier": "t_struct$_G1Point_$21_memory",
                        "typeString": "struct Curve.G1Point memory"
                      }
                    },
                    "nodeType": "VariableDeclarationStatement",
                    "src": "1037:61:2"
                  },
                  {
                    "assignments": [
                      968
                    ],
                    "declarations": [
                      {
                        "constant": false,
                        "id": 968,
                        "name": "kG",
                        "nodeType": "VariableDeclaration",
                        "scope": 996,
                        "src": "1106:23:2",
                        "stateVariable": false,
                        "storageLocation": "memory",
                        "typeDescriptions": {
                          "typeIdentifier": "t_struct$_G1Point_$21_memory_ptr",
                          "typeString": "struct Curve.G1Point memory"
                        },
                        "typeName": {
                          "contractScope": null,
                          "id": 967,
                          "name": "Curve.G1Point",
                          "nodeType": "UserDefinedTypeName",
                          "referencedDeclaration": 21,
                          "src": "1106:13:2",
                          "typeDescriptions": {
                            "typeIdentifier": "t_struct$_G1Point_$21_storage_ptr",
                            "typeString": "struct Curve.G1Point storage pointer"
                          }
                        },
                        "value": null,
                        "visibility": "internal"
                      }
                    ],
                    "id": 978,
                    "initialValue": {
                      "argumentTypes": null,
                      "arguments": [
                        {
                          "argumentTypes": null,
                          "id": 971,
                          "name": "sG",
                          "nodeType": "Identifier",
                          "overloadedDeclarations": [],
                          "referencedDeclaration": 938,
                          "src": "1144:2:2",
                          "typeDescriptions": {
                            "typeIdentifier": "t_struct$_G1Point_$21_memory_ptr",
                            "typeString": "struct Curve.G1Point memory"
                          }
                        },
                        {
                          "argumentTypes": null,
                          "arguments": [
                            {
                              "argumentTypes": null,
                              "id": 974,
                              "name": "xG",
                              "nodeType": "Identifier",
                              "overloadedDeclarations": [],
                              "referencedDeclaration": 954,
                              "src": "1160:2:2",
                              "typeDescriptions": {
                                "typeIdentifier": "t_struct$_G1Point_$21_memory_ptr",
                                "typeString": "struct Curve.G1Point memory"
                              }
                            },
                            {
                              "argumentTypes": null,
                              "id": 975,
                              "name": "e",
                              "nodeType": "Identifier",
                              "overloadedDeclarations": [],
                              "referencedDeclaration": 930,
                              "src": "1164:1:2",
                              "typeDescriptions": {
                                "typeIdentifier": "t_uint256",
                                "typeString": "uint256"
                              }
                            }
                          ],
                          "expression": {
                            "argumentTypes": [
                              {
                                "typeIdentifier": "t_struct$_G1Point_$21_memory_ptr",
                                "typeString": "struct Curve.G1Point memory"
                              },
                              {
                                "typeIdentifier": "t_uint256",
                                "typeString": "uint256"
                              }
                            ],
                            "expression": {
                              "argumentTypes": null,
                              "id": 972,
                              "name": "Curve",
                              "nodeType": "Identifier",
                              "overloadedDeclarations": [],
                              "referencedDeclaration": 814,
                              "src": "1148:5:2",
                              "typeDescriptions": {
                                "typeIdentifier": "t_type$_t_contract$_Curve_$814_$",
                                "typeString": "type(library Curve)"
                              }
                            },
                            "id": 973,
                            "isConstant": false,
                            "isLValue": false,
                            "isPure": false,
                            "lValueRequested": false,
                            "memberName": "g1mul",
                            "nodeType": "MemberAccess",
                            "referencedDeclaration": 417,
                            "src": "1148:11:2",
                            "typeDescriptions": {
                              "typeIdentifier": "t_function_internal_view$_t_struct$_G1Point_$21_memory_ptr_$_t_uint256_$returns$_t_struct$_G1Point_$21_memory_ptr_$",
                              "typeString": "function (struct Curve.G1Point memory,uint256) view returns (struct Curve.G1Point memory)"
                            }
                          },
                          "id": 976,
                          "isConstant": false,
                          "isLValue": false,
                          "isPure": false,
                          "kind": "functionCall",
                          "lValueRequested": false,
                          "names": [],
                          "nodeType": "FunctionCall",
                          "src": "1148:18:2",
                          "typeDescriptions": {
                            "typeIdentifier": "t_struct$_G1Point_$21_memory_ptr",
                            "typeString": "struct Curve.G1Point memory"
                          }
                        }
                      ],
                      "expression": {
                        "argumentTypes": [
                          {
                            "typeIdentifier": "t_struct$_G1Point_$21_memory_ptr",
                            "typeString": "struct Curve.G1Point memory"
                          },
                          {
                            "typeIdentifier": "t_struct$_G1Point_$21_memory_ptr",
                            "typeString": "struct Curve.G1Point memory"
                          }
                        ],
                        "expression": {
                          "argumentTypes": null,
                          "id": 969,
                          "name": "Curve",
                          "nodeType": "Identifier",
                          "overloadedDeclarations": [],
                          "referencedDeclaration": 814,
                          "src": "1132:5:2",
                          "typeDescriptions": {
                            "typeIdentifier": "t_type$_t_contract$_Curve_$814_$",
                            "typeString": "type(library Curve)"
                          }
                        },
                        "id": 970,
                        "isConstant": false,
                        "isLValue": false,
                        "isPure": false,
                        "lValueRequested": false,
                        "memberName": "g1add",
                        "nodeType": "MemberAccess",
                        "referencedDeclaration": 373,
                        "src": "1132:11:2",
                        "typeDescriptions": {
                          "typeIdentifier": "t_function_internal_view$_t_struct$_G1Point_$21_memory_ptr_$_t_struct$_G1Point_$21_memory_ptr_$returns$_t_struct$_G1Point_$21_memory_ptr_$",
                          "typeString": "function (struct Curve.G1Point memory,struct Curve.G1Point memory) view returns (struct Curve.G1Point memory)"
                        }
                      },
                      "id": 977,
                      "isConstant": false,
                      "isLValue": false,
                      "isPure": false,
                      "kind": "functionCall",
                      "lValueRequested": false,
                      "names": [],
                      "nodeType": "FunctionCall",
                      "src": "1132:35:2",
                      "typeDescriptions": {
                        "typeIdentifier": "t_struct$_G1Point_$21_memory_ptr",
                        "typeString": "struct Curve.G1Point memory"
                      }
                    },
                    "nodeType": "VariableDeclarationStatement",
                    "src": "1106:61:2"
                  },
                  {
                    "expression": {
                      "argumentTypes": null,
                      "arguments": [
                        {
                          "argumentTypes": null,
                          "arguments": [
                            {
                              "argumentTypes": null,
                              "baseExpression": {
                                "argumentTypes": null,
                                "id": 981,
                                "name": "pubkey",
                                "nodeType": "Identifier",
                                "overloadedDeclarations": [],
                                "referencedDeclaration": 924,
                                "src": "1200:6:2",
                                "typeDescriptions": {
                                  "typeIdentifier": "t_array$_t_uint256_$2_memory_ptr",
                                  "typeString": "uint256[2] memory"
                                }
                              },
                              "id": 983,
                              "indexExpression": {
                                "argumentTypes": null,
                                "hexValue": "30",
                                "id": 982,
                                "isConstant": false,
                                "isLValue": false,
                                "isPure": true,
                                "kind": "number",
                                "lValueRequested": false,
                                "nodeType": "Literal",
                                "src": "1207:1:2",
                                "subdenomination": null,
                                "typeDescriptions": {
                                  "typeIdentifier": "t_rational_0_by_1",
                                  "typeString": "int_const 0"
                                },
                                "value": "0"
                              },
                              "isConstant": false,
                              "isLValue": true,
                              "isPure": false,
                              "lValueRequested": false,
                              "nodeType": "IndexAccess",
                              "src": "1200:9:2",
                              "typeDescriptions": {
                                "typeIdentifier": "t_uint256",
                                "typeString": "uint256"
                              }
                            },
                            {
                              "argumentTypes": null,
                              "baseExpression": {
                                "argumentTypes": null,
                                "id": 984,
                                "name": "pubkey",
                                "nodeType": "Identifier",
                                "overloadedDeclarations": [],
                                "referencedDeclaration": 924,
                                "src": "1211:6:2",
                                "typeDescriptions": {
                                  "typeIdentifier": "t_array$_t_uint256_$2_memory_ptr",
                                  "typeString": "uint256[2] memory"
                                }
                              },
                              "id": 986,
                              "indexExpression": {
                                "argumentTypes": null,
                                "hexValue": "31",
                                "id": 985,
                                "isConstant": false,
                                "isLValue": false,
                                "isPure": true,
                                "kind": "number",
                                "lValueRequested": false,
                                "nodeType": "Literal",
                                "src": "1218:1:2",
                                "subdenomination": null,
                                "typeDescriptions": {
                                  "typeIdentifier": "t_rational_1_by_1",
                                  "typeString": "int_const 1"
                                },
                                "value": "1"
                              },
                              "isConstant": false,
                              "isLValue": true,
                              "isPure": false,
                              "lValueRequested": false,
                              "nodeType": "IndexAccess",
                              "src": "1211:9:2",
                              "typeDescriptions": {
                                "typeIdentifier": "t_uint256",
                                "typeString": "uint256"
                              }
                            },
                            {
                              "argumentTypes": null,
                              "expression": {
                                "argumentTypes": null,
                                "id": 987,
                                "name": "kG",
                                "nodeType": "Identifier",
                                "overloadedDeclarations": [],
                                "referencedDeclaration": 968,
                                "src": "1222:2:2",
                                "typeDescriptions": {
                                  "typeIdentifier": "t_struct$_G1Point_$21_memory_ptr",
                                  "typeString": "struct Curve.G1Point memory"
                                }
                              },
                              "id": 988,
                              "isConstant": false,
                              "isLValue": true,
                              "isPure": false,
                              "lValueRequested": false,
                              "memberName": "X",
                              "nodeType": "MemberAccess",
                              "referencedDeclaration": 18,
                              "src": "1222:4:2",
                              "typeDescriptions": {
                                "typeIdentifier": "t_uint256",
                                "typeString": "uint256"
                              }
                            },
                            {
                              "argumentTypes": null,
                              "expression": {
                                "argumentTypes": null,
                                "id": 989,
                                "name": "kG",
                                "nodeType": "Identifier",
                                "overloadedDeclarations": [],
                                "referencedDeclaration": 968,
                                "src": "1228:2:2",
                                "typeDescriptions": {
                                  "typeIdentifier": "t_struct$_G1Point_$21_memory_ptr",
                                  "typeString": "struct Curve.G1Point memory"
                                }
                              },
                              "id": 990,
                              "isConstant": false,
                              "isLValue": true,
                              "isPure": false,
                              "lValueRequested": false,
                              "memberName": "Y",
                              "nodeType": "MemberAccess",
                              "referencedDeclaration": 20,
                              "src": "1228:4:2",
                              "typeDescriptions": {
                                "typeIdentifier": "t_uint256",
                                "typeString": "uint256"
                              }
                            },
                            {
                              "argumentTypes": null,
                              "id": 991,
                              "name": "message",
                              "nodeType": "Identifier",
                              "overloadedDeclarations": [],
                              "referencedDeclaration": 926,
                              "src": "1234:7:2",
                              "typeDescriptions": {
                                "typeIdentifier": "t_uint256",
                                "typeString": "uint256"
                              }
                            }
                          ],
                          "expression": {
                            "argumentTypes": [
                              {
                                "typeIdentifier": "t_uint256",
                                "typeString": "uint256"
                              },
                              {
                                "typeIdentifier": "t_uint256",
                                "typeString": "uint256"
                              },
                              {
                                "typeIdentifier": "t_uint256",
                                "typeString": "uint256"
                              },
                              {
                                "typeIdentifier": "t_uint256",
                                "typeString": "uint256"
                              },
                              {
                                "typeIdentifier": "t_uint256",
                                "typeString": "uint256"
                              }
                            ],
                            "id": 980,
                            "name": "keccak256",
                            "nodeType": "Identifier",
                            "overloadedDeclarations": [],
                            "referencedDeclaration": 1028,
                            "src": "1190:9:2",
                            "typeDescriptions": {
                              "typeIdentifier": "t_function_sha3_pure$__$returns$_t_bytes32_$",
                              "typeString": "function () pure returns (bytes32)"
                            }
                          },
                          "id": 992,
                          "isConstant": false,
                          "isLValue": false,
                          "isPure": false,
                          "kind": "functionCall",
                          "lValueRequested": false,
                          "names": [],
                          "nodeType": "FunctionCall",
                          "src": "1190:52:2",
                          "typeDescriptions": {
                            "typeIdentifier": "t_bytes32",
                            "typeString": "bytes32"
                          }
                        }
                      ],
                      "expression": {
                        "argumentTypes": [
                          {
                            "typeIdentifier": "t_bytes32",
                            "typeString": "bytes32"
                          }
                        ],
                        "id": 979,
                        "isConstant": false,
                        "isLValue": false,
                        "isPure": true,
                        "lValueRequested": false,
                        "nodeType": "ElementaryTypeNameExpression",
                        "src": "1182:7:2",
                        "typeDescriptions": {
                          "typeIdentifier": "t_type$_t_uint256_$",
                          "typeString": "type(uint256)"
                        },
                        "typeName": "uint256"
                      },
                      "id": 993,
                      "isConstant": false,
                      "isLValue": false,
                      "isPure": false,
                      "kind": "typeConversion",
                      "lValueRequested": false,
                      "names": [],
                      "nodeType": "FunctionCall",
                      "src": "1182:61:2",
                      "typeDescriptions": {
                        "typeIdentifier": "t_uint256",
                        "typeString": "uint256"
                      }
                    },
                    "functionReturnParameters": 934,
                    "id": 994,
                    "nodeType": "Return",
                    "src": "1175:68:2"
                  }
                ]
              },
              "id": 996,
              "implemented": true,
              "isConstructor": false,
              "isDeclaredConst": true,
              "modifiers": [],
              "name": "CalcProof",
              "nodeType": "FunctionDefinition",
              "parameters": {
                "id": 931,
                "nodeType": "ParameterList",
                "parameters": [
                  {
                    "constant": false,
                    "id": 924,
                    "name": "pubkey",
                    "nodeType": "VariableDeclaration",
                    "scope": 996,
                    "src": "848:17:2",
                    "stateVariable": false,
                    "storageLocation": "default",
                    "typeDescriptions": {
                      "typeIdentifier": "t_array$_t_uint256_$2_memory_ptr",
                      "typeString": "uint256[2] memory"
                    },
                    "typeName": {
                      "baseType": {
                        "id": 921,
                        "name": "uint256",
                        "nodeType": "ElementaryTypeName",
                        "src": "848:7:2",
                        "typeDescriptions": {
                          "typeIdentifier": "t_uint256",
                          "typeString": "uint256"
                        }
                      },
                      "id": 923,
                      "length": {
                        "argumentTypes": null,
                        "hexValue": "32",
                        "id": 922,
                        "isConstant": false,
                        "isLValue": false,
                        "isPure": false,
                        "kind": "number",
                        "lValueRequested": false,
                        "nodeType": "Literal",
                        "src": "856:1:2",
                        "subdenomination": null,
                        "typeDescriptions": {
                          "typeIdentifier": "t_rational_2_by_1",
                          "typeString": "int_const 2"
                        },
                        "value": "2"
                      },
                      "nodeType": "ArrayTypeName",
                      "src": "848:10:2",
                      "typeDescriptions": {
                        "typeIdentifier": "t_array$_t_uint256_$2_storage_ptr",
                        "typeString": "uint256[2] storage pointer"
                      }
                    },
                    "value": null,
                    "visibility": "internal"
                  },
                  {
                    "constant": false,
                    "id": 926,
                    "name": "message",
                    "nodeType": "VariableDeclaration",
                    "scope": 996,
                    "src": "867:15:2",
                    "stateVariable": false,
                    "storageLocation": "default",
                    "typeDescriptions": {
                      "typeIdentifier": "t_uint256",
                      "typeString": "uint256"
                    },
                    "typeName": {
                      "id": 925,
                      "name": "uint256",
                      "nodeType": "ElementaryTypeName",
                      "src": "867:7:2",
                      "typeDescriptions": {
                        "typeIdentifier": "t_uint256",
                        "typeString": "uint256"
                      }
                    },
                    "value": null,
                    "visibility": "internal"
                  },
                  {
                    "constant": false,
                    "id": 928,
                    "name": "s",
                    "nodeType": "VariableDeclaration",
                    "scope": 996,
                    "src": "884:9:2",
                    "stateVariable": false,
                    "storageLocation": "default",
                    "typeDescriptions": {
                      "typeIdentifier": "t_uint256",
                      "typeString": "uint256"
                    },
                    "typeName": {
                      "id": 927,
                      "name": "uint256",
                      "nodeType": "ElementaryTypeName",
                      "src": "884:7:2",
                      "typeDescriptions": {
                        "typeIdentifier": "t_uint256",
                        "typeString": "uint256"
                      }
                    },
                    "value": null,
                    "visibility": "internal"
                  },
                  {
                    "constant": false,
                    "id": 930,
                    "name": "e",
                    "nodeType": "VariableDeclaration",
                    "scope": 996,
                    "src": "895:9:2",
                    "stateVariable": false,
                    "storageLocation": "default",
                    "typeDescriptions": {
                      "typeIdentifier": "t_uint256",
                      "typeString": "uint256"
                    },
                    "typeName": {
                      "id": 929,
                      "name": "uint256",
                      "nodeType": "ElementaryTypeName",
                      "src": "895:7:2",
                      "typeDescriptions": {
                        "typeIdentifier": "t_uint256",
                        "typeString": "uint256"
                      }
                    },
                    "value": null,
                    "visibility": "internal"
                  }
                ],
                "src": "846:60:2"
              },
              "payable": false,
              "returnParameters": {
                "id": 934,
                "nodeType": "ParameterList",
                "parameters": [
                  {
                    "constant": false,
                    "id": 933,
                    "name": "",
                    "nodeType": "VariableDeclaration",
                    "scope": 996,
                    "src": "946:7:2",
                    "stateVariable": false,
                    "storageLocation": "default",
                    "typeDescriptions": {
                      "typeIdentifier": "t_uint256",
                      "typeString": "uint256"
                    },
                    "typeName": {
                      "id": 932,
                      "name": "uint256",
                      "nodeType": "ElementaryTypeName",
                      "src": "946:7:2",
                      "typeDescriptions": {
                        "typeIdentifier": "t_uint256",
                        "typeString": "uint256"
                      }
                    },
                    "value": null,
                    "visibility": "internal"
                  }
                ],
                "src": "945:9:2"
              },
              "scope": 1022,
              "src": "828:420:2",
              "stateMutability": "view",
              "superFunction": null,
              "visibility": "internal"
            },
            {
              "body": {
                "id": 1020,
                "nodeType": "Block",
                "src": "1382:57:2",
                "statements": [
                  {
                    "expression": {
                      "argumentTypes": null,
                      "commonType": {
                        "typeIdentifier": "t_uint256",
                        "typeString": "uint256"
                      },
                      "id": 1018,
                      "isConstant": false,
                      "isLValue": false,
                      "isPure": false,
                      "lValueRequested": false,
                      "leftExpression": {
                        "argumentTypes": null,
                        "id": 1011,
                        "name": "e",
                        "nodeType": "Identifier",
                        "overloadedDeclarations": [],
                        "referencedDeclaration": 1006,
                        "src": "1397:1:2",
                        "typeDescriptions": {
                          "typeIdentifier": "t_uint256",
                          "typeString": "uint256"
                        }
                      },
                      "nodeType": "BinaryOperation",
                      "operator": "==",
                      "rightExpression": {
                        "argumentTypes": null,
                        "arguments": [
                          {
                            "argumentTypes": null,
                            "id": 1013,
                            "name": "pubkey",
                            "nodeType": "Identifier",
                            "overloadedDeclarations": [],
                            "referencedDeclaration": 1000,
                            "src": "1412:6:2",
                            "typeDescriptions": {
                              "typeIdentifier": "t_array$_t_uint256_$2_memory_ptr",
                              "typeString": "uint256[2] memory"
                            }
                          },
                          {
                            "argumentTypes": null,
                            "id": 1014,
                            "name": "message",
                            "nodeType": "Identifier",
                            "overloadedDeclarations": [],
                            "referencedDeclaration": 1002,
                            "src": "1420:7:2",
                            "typeDescriptions": {
                              "typeIdentifier": "t_uint256",
                              "typeString": "uint256"
                            }
                          },
                          {
                            "argumentTypes": null,
                            "id": 1015,
                            "name": "s",
                            "nodeType": "Identifier",
                            "overloadedDeclarations": [],
                            "referencedDeclaration": 1004,
                            "src": "1429:1:2",
                            "typeDescriptions": {
                              "typeIdentifier": "t_uint256",
                              "typeString": "uint256"
                            }
                          },
                          {
                            "argumentTypes": null,
                            "id": 1016,
                            "name": "e",
                            "nodeType": "Identifier",
                            "overloadedDeclarations": [],
                            "referencedDeclaration": 1006,
                            "src": "1432:1:2",
                            "typeDescriptions": {
                              "typeIdentifier": "t_uint256",
                              "typeString": "uint256"
                            }
                          }
                        ],
                        "expression": {
                          "argumentTypes": [
                            {
                              "typeIdentifier": "t_array$_t_uint256_$2_memory_ptr",
                              "typeString": "uint256[2] memory"
                            },
                            {
                              "typeIdentifier": "t_uint256",
                              "typeString": "uint256"
                            },
                            {
                              "typeIdentifier": "t_uint256",
                              "typeString": "uint256"
                            },
                            {
                              "typeIdentifier": "t_uint256",
                              "typeString": "uint256"
                            }
                          ],
                          "id": 1012,
                          "name": "CalcProof",
                          "nodeType": "Identifier",
                          "overloadedDeclarations": [],
                          "referencedDeclaration": 996,
                          "src": "1402:9:2",
                          "typeDescriptions": {
                            "typeIdentifier": "t_function_internal_view$_t_array$_t_uint256_$2_memory_ptr_$_t_uint256_$_t_uint256_$_t_uint256_$returns$_t_uint256_$",
                            "typeString": "function (uint256[2] memory,uint256,uint256,uint256) view returns (uint256)"
                          }
                        },
                        "id": 1017,
                        "isConstant": false,
                        "isLValue": false,
                        "isPure": false,
                        "kind": "functionCall",
                        "lValueRequested": false,
                        "names": [],
                        "nodeType": "FunctionCall",
                        "src": "1402:32:2",
                        "typeDescriptions": {
                          "typeIdentifier": "t_uint256",
                          "typeString": "uint256"
                        }
                      },
                      "src": "1397:37:2",
                      "typeDescriptions": {
                        "typeIdentifier": "t_bool",
                        "typeString": "bool"
                      }
                    },
                    "functionReturnParameters": 1010,
                    "id": 1019,
                    "nodeType": "Return",
                    "src": "1390:44:2"
                  }
                ]
              },
              "id": 1021,
              "implemented": true,
              "isConstructor": false,
              "isDeclaredConst": true,
              "modifiers": [],
              "name": "VerifyProof",
              "nodeType": "FunctionDefinition",
              "parameters": {
                "id": 1007,
                "nodeType": "ParameterList",
                "parameters": [
                  {
                    "constant": false,
                    "id": 1000,
                    "name": "pubkey",
                    "nodeType": "VariableDeclaration",
                    "scope": 1021,
                    "src": "1276:17:2",
                    "stateVariable": false,
                    "storageLocation": "default",
                    "typeDescriptions": {
                      "typeIdentifier": "t_array$_t_uint256_$2_memory_ptr",
                      "typeString": "uint256[2] memory"
                    },
                    "typeName": {
                      "baseType": {
                        "id": 997,
                        "name": "uint256",
                        "nodeType": "ElementaryTypeName",
                        "src": "1276:7:2",
                        "typeDescriptions": {
                          "typeIdentifier": "t_uint256",
                          "typeString": "uint256"
                        }
                      },
                      "id": 999,
                      "length": {
                        "argumentTypes": null,
                        "hexValue": "32",
                        "id": 998,
                        "isConstant": false,
                        "isLValue": false,
                        "isPure": false,
                        "kind": "number",
                        "lValueRequested": false,
                        "nodeType": "Literal",
                        "src": "1284:1:2",
                        "subdenomination": null,
                        "typeDescriptions": {
                          "typeIdentifier": "t_rational_2_by_1",
                          "typeString": "int_const 2"
                        },
                        "value": "2"
                      },
                      "nodeType": "ArrayTypeName",
                      "src": "1276:10:2",
                      "typeDescriptions": {
                        "typeIdentifier": "t_array$_t_uint256_$2_storage_ptr",
                        "typeString": "uint256[2] storage pointer"
                      }
                    },
                    "value": null,
                    "visibility": "internal"
                  },
                  {
                    "constant": false,
                    "id": 1002,
                    "name": "message",
                    "nodeType": "VariableDeclaration",
                    "scope": 1021,
                    "src": "1295:15:2",
                    "stateVariable": false,
                    "storageLocation": "default",
                    "typeDescriptions": {
                      "typeIdentifier": "t_uint256",
                      "typeString": "uint256"
                    },
                    "typeName": {
                      "id": 1001,
                      "name": "uint256",
                      "nodeType": "ElementaryTypeName",
                      "src": "1295:7:2",
                      "typeDescriptions": {
                        "typeIdentifier": "t_uint256",
                        "typeString": "uint256"
                      }
                    },
                    "value": null,
                    "visibility": "internal"
                  },
                  {
                    "constant": false,
                    "id": 1004,
                    "name": "s",
                    "nodeType": "VariableDeclaration",
                    "scope": 1021,
                    "src": "1312:9:2",
                    "stateVariable": false,
                    "storageLocation": "default",
                    "typeDescriptions": {
                      "typeIdentifier": "t_uint256",
                      "typeString": "uint256"
                    },
                    "typeName": {
                      "id": 1003,
                      "name": "uint256",
                      "nodeType": "ElementaryTypeName",
                      "src": "1312:7:2",
                      "typeDescriptions": {
                        "typeIdentifier": "t_uint256",
                        "typeString": "uint256"
                      }
                    },
                    "value": null,
                    "visibility": "internal"
                  },
                  {
                    "constant": false,
                    "id": 1006,
                    "name": "e",
                    "nodeType": "VariableDeclaration",
                    "scope": 1021,
                    "src": "1323:9:2",
                    "stateVariable": false,
                    "storageLocation": "default",
                    "typeDescriptions": {
                      "typeIdentifier": "t_uint256",
                      "typeString": "uint256"
                    },
                    "typeName": {
                      "id": 1005,
                      "name": "uint256",
                      "nodeType": "ElementaryTypeName",
                      "src": "1323:7:2",
                      "typeDescriptions": {
                        "typeIdentifier": "t_uint256",
                        "typeString": "uint256"
                      }
                    },
                    "value": null,
                    "visibility": "internal"
                  }
                ],
                "src": "1274:60:2"
              },
              "payable": false,
              "returnParameters": {
                "id": 1010,
                "nodeType": "ParameterList",
                "parameters": [
                  {
                    "constant": false,
                    "id": 1009,
                    "name": "",
                    "nodeType": "VariableDeclaration",
                    "scope": 1021,
                    "src": "1374:4:2",
                    "stateVariable": false,
                    "storageLocation": "default",
                    "typeDescriptions": {
                      "typeIdentifier": "t_bool",
                      "typeString": "bool"
                    },
                    "typeName": {
                      "id": 1008,
                      "name": "bool",
                      "nodeType": "ElementaryTypeName",
                      "src": "1374:4:2",
                      "typeDescriptions": {
                        "typeIdentifier": "t_bool",
                        "typeString": "bool"
                      }
                    },
                    "value": null,
                    "visibility": "internal"
                  }
                ],
                "src": "1373:6:2"
              },
              "scope": 1022,
              "src": "1254:185:2",
              "stateMutability": "view",
              "superFunction": null,
              "visibility": "internal"
            }
          ],
          "scope": 1023,
          "src": "123:1319:2"
        }
      ],
      "src": "0:1442:2"
    },
    "legacyAST": {
      "absolutePath": "/C/Users/eason/Documents/GitHub/SmartWerewolf/contracts/schnorr.sol",
      "exportedSymbols": {
        "Schnorr": [
          1022
        ]
      },
      "id": 1023,
      "nodeType": "SourceUnit",
      "nodes": [
        {
          "id": 816,
          "literals": [
            "solidity",
            "^",
            "0.4",
            ".14"
          ],
          "nodeType": "PragmaDirective",
          "src": "0:24:2"
        },
        {
          "absolutePath": "/C/Users/eason/Documents/GitHub/SmartWerewolf/contracts/Curve.sol",
          "file": "./Curve.sol",
          "id": 817,
          "nodeType": "ImportDirective",
          "scope": 1023,
          "sourceUnit": 3,
          "src": "28:21:2",
          "symbolAliases": [],
          "unitAlias": ""
        },
        {
          "baseContracts": [],
          "contractDependencies": [],
          "contractKind": "library",
          "documentation": null,
          "fullyImplemented": true,
          "id": 1022,
          "linearizedBaseContracts": [
            1022
          ],
          "name": "Schnorr",
          "nodeType": "ContractDefinition",
          "nodes": [
            {
              "body": {
                "id": 919,
                "nodeType": "Block",
                "src": "368:394:2",
                "statements": [
                  {
                    "assignments": [
                      835
                    ],
                    "declarations": [
                      {
                        "constant": false,
                        "id": 835,
                        "name": "xG",
                        "nodeType": "VariableDeclaration",
                        "scope": 920,
                        "src": "373:23:2",
                        "stateVariable": false,
                        "storageLocation": "memory",
                        "typeDescriptions": {
                          "typeIdentifier": "t_struct$_G1Point_$21_memory_ptr",
                          "typeString": "struct Curve.G1Point memory"
                        },
                        "typeName": {
                          "contractScope": null,
                          "id": 834,
                          "name": "Curve.G1Point",
                          "nodeType": "UserDefinedTypeName",
                          "referencedDeclaration": 21,
                          "src": "373:13:2",
                          "typeDescriptions": {
                            "typeIdentifier": "t_struct$_G1Point_$21_storage_ptr",
                            "typeString": "struct Curve.G1Point storage pointer"
                          }
                        },
                        "value": null,
                        "visibility": "internal"
                      }
                    ],
                    "id": 847,
                    "initialValue": {
                      "argumentTypes": null,
                      "arguments": [
                        {
                          "argumentTypes": null,
                          "arguments": [],
                          "expression": {
                            "argumentTypes": [],
                            "expression": {
                              "argumentTypes": null,
                              "id": 838,
                              "name": "Curve",
                              "nodeType": "Identifier",
                              "overloadedDeclarations": [],
                              "referencedDeclaration": 814,
                              "src": "411:5:2",
                              "typeDescriptions": {
                                "typeIdentifier": "t_type$_t_contract$_Curve_$814_$",
                                "typeString": "type(library Curve)"
                              }
                            },
                            "id": 839,
                            "isConstant": false,
                            "isLValue": false,
                            "isPure": false,
                            "lValueRequested": false,
                            "memberName": "P1",
                            "nodeType": "MemberAccess",
                            "referencedDeclaration": 65,
                            "src": "411:8:2",
                            "typeDescriptions": {
                              "typeIdentifier": "t_function_internal_pure$__$returns$_t_struct$_G1Point_$21_memory_ptr_$",
                              "typeString": "function () pure returns (struct Curve.G1Point memory)"
                            }
                          },
                          "id": 840,
                          "isConstant": false,
                          "isLValue": false,
                          "isPure": false,
                          "kind": "functionCall",
                          "lValueRequested": false,
                          "names": [],
                          "nodeType": "FunctionCall",
                          "src": "411:10:2",
                          "typeDescriptions": {
                            "typeIdentifier": "t_struct$_G1Point_$21_memory_ptr",
                            "typeString": "struct Curve.G1Point memory"
                          }
                        },
                        {
                          "argumentTypes": null,
                          "commonType": {
                            "typeIdentifier": "t_uint256",
                            "typeString": "uint256"
                          },
                          "id": 845,
                          "isConstant": false,
                          "isLValue": false,
                          "isPure": false,
                          "lValueRequested": false,
                          "leftExpression": {
                            "argumentTypes": null,
                            "id": 841,
                            "name": "secret",
                            "nodeType": "Identifier",
                            "overloadedDeclarations": [],
                            "referencedDeclaration": 819,
                            "src": "423:6:2",
                            "typeDescriptions": {
                              "typeIdentifier": "t_uint256",
                              "typeString": "uint256"
                            }
                          },
                          "nodeType": "BinaryOperation",
                          "operator": "%",
                          "rightExpression": {
                            "argumentTypes": null,
                            "arguments": [],
                            "expression": {
                              "argumentTypes": [],
                              "expression": {
                                "argumentTypes": null,
                                "id": 842,
                                "name": "Curve",
                                "nodeType": "Identifier",
                                "overloadedDeclarations": [],
                                "referencedDeclaration": 814,
                                "src": "432:5:2",
                                "typeDescriptions": {
                                  "typeIdentifier": "t_type$_t_contract$_Curve_$814_$",
                                  "typeString": "type(library Curve)"
                                }
                              },
                              "id": 843,
                              "isConstant": false,
                              "isLValue": false,
                              "isPure": false,
                              "lValueRequested": false,
                              "memberName": "N",
                              "nodeType": "MemberAccess",
                              "referencedDeclaration": 54,
                              "src": "432:7:2",
                              "typeDescriptions": {
                                "typeIdentifier": "t_function_internal_pure$__$returns$_t_uint256_$",
                                "typeString": "function () pure returns (uint256)"
                              }
                            },
                            "id": 844,
                            "isConstant": false,
                            "isLValue": false,
                            "isPure": false,
                            "kind": "functionCall",
                            "lValueRequested": false,
                            "names": [],
                            "nodeType": "FunctionCall",
                            "src": "432:9:2",
                            "typeDescriptions": {
                              "typeIdentifier": "t_uint256",
                              "typeString": "uint256"
                            }
                          },
                          "src": "423:18:2",
                          "typeDescriptions": {
                            "typeIdentifier": "t_uint256",
                            "typeString": "uint256"
                          }
                        }
                      ],
                      "expression": {
                        "argumentTypes": [
                          {
                            "typeIdentifier": "t_struct$_G1Point_$21_memory_ptr",
                            "typeString": "struct Curve.G1Point memory"
                          },
                          {
                            "typeIdentifier": "t_uint256",
                            "typeString": "uint256"
                          }
                        ],
                        "expression": {
                          "argumentTypes": null,
                          "id": 836,
                          "name": "Curve",
                          "nodeType": "Identifier",
                          "overloadedDeclarations": [],
                          "referencedDeclaration": 814,
                          "src": "399:5:2",
                          "typeDescriptions": {
                            "typeIdentifier": "t_type$_t_contract$_Curve_$814_$",
                            "typeString": "type(library Curve)"
                          }
                        },
                        "id": 837,
                        "isConstant": false,
                        "isLValue": false,
                        "isPure": false,
                        "lValueRequested": false,
                        "memberName": "g1mul",
                        "nodeType": "MemberAccess",
                        "referencedDeclaration": 417,
                        "src": "399:11:2",
                        "typeDescriptions": {
                          "typeIdentifier": "t_function_internal_view$_t_struct$_G1Point_$21_memory_ptr_$_t_uint256_$returns$_t_struct$_G1Point_$21_memory_ptr_$",
                          "typeString": "function (struct Curve.G1Point memory,uint256) view returns (struct Curve.G1Point memory)"
                        }
                      },
                      "id": 846,
                      "isConstant": false,
                      "isLValue": false,
                      "isPure": false,
                      "kind": "functionCall",
                      "lValueRequested": false,
                      "names": [],
                      "nodeType": "FunctionCall",
                      "src": "399:43:2",
                      "typeDescriptions": {
                        "typeIdentifier": "t_struct$_G1Point_$21_memory_ptr",
                        "typeString": "struct Curve.G1Point memory"
                      }
                    },
                    "nodeType": "VariableDeclarationStatement",
                    "src": "373:69:2"
                  },
                  {
                    "expression": {
                      "argumentTypes": null,
                      "id": 853,
                      "isConstant": false,
                      "isLValue": false,
                      "isPure": false,
                      "lValueRequested": false,
                      "leftHandSide": {
                        "argumentTypes": null,
                        "baseExpression": {
                          "argumentTypes": null,
                          "id": 848,
                          "name": "out_pubkey",
                          "nodeType": "Identifier",
                          "overloadedDeclarations": [],
                          "referencedDeclaration": 826,
                          "src": "447:10:2",
                          "typeDescriptions": {
                            "typeIdentifier": "t_array$_t_uint256_$2_memory_ptr",
                            "typeString": "uint256[2] memory"
                          }
                        },
                        "id": 850,
                        "indexExpression": {
                          "argumentTypes": null,
                          "hexValue": "30",
                          "id": 849,
                          "isConstant": false,
                          "isLValue": false,
                          "isPure": true,
                          "kind": "number",
                          "lValueRequested": false,
                          "nodeType": "Literal",
                          "src": "458:1:2",
                          "subdenomination": null,
                          "typeDescriptions": {
                            "typeIdentifier": "t_rational_0_by_1",
                            "typeString": "int_const 0"
                          },
                          "value": "0"
                        },
                        "isConstant": false,
                        "isLValue": true,
                        "isPure": false,
                        "lValueRequested": true,
                        "nodeType": "IndexAccess",
                        "src": "447:13:2",
                        "typeDescriptions": {
                          "typeIdentifier": "t_uint256",
                          "typeString": "uint256"
                        }
                      },
                      "nodeType": "Assignment",
                      "operator": "=",
                      "rightHandSide": {
                        "argumentTypes": null,
                        "expression": {
                          "argumentTypes": null,
                          "id": 851,
                          "name": "xG",
                          "nodeType": "Identifier",
                          "overloadedDeclarations": [],
                          "referencedDeclaration": 835,
                          "src": "463:2:2",
                          "typeDescriptions": {
                            "typeIdentifier": "t_struct$_G1Point_$21_memory_ptr",
                            "typeString": "struct Curve.G1Point memory"
                          }
                        },
                        "id": 852,
                        "isConstant": false,
                        "isLValue": true,
                        "isPure": false,
                        "lValueRequested": false,
                        "memberName": "X",
                        "nodeType": "MemberAccess",
                        "referencedDeclaration": 18,
                        "src": "463:4:2",
                        "typeDescriptions": {
                          "typeIdentifier": "t_uint256",
                          "typeString": "uint256"
                        }
                      },
                      "src": "447:20:2",
                      "typeDescriptions": {
                        "typeIdentifier": "t_uint256",
                        "typeString": "uint256"
                      }
                    },
                    "id": 854,
                    "nodeType": "ExpressionStatement",
                    "src": "447:20:2"
                  },
                  {
                    "expression": {
                      "argumentTypes": null,
                      "id": 860,
                      "isConstant": false,
                      "isLValue": false,
                      "isPure": false,
                      "lValueRequested": false,
                      "leftHandSide": {
                        "argumentTypes": null,
                        "baseExpression": {
                          "argumentTypes": null,
                          "id": 855,
                          "name": "out_pubkey",
                          "nodeType": "Identifier",
                          "overloadedDeclarations": [],
                          "referencedDeclaration": 826,
                          "src": "472:10:2",
                          "typeDescriptions": {
                            "typeIdentifier": "t_array$_t_uint256_$2_memory_ptr",
                            "typeString": "uint256[2] memory"
                          }
                        },
                        "id": 857,
                        "indexExpression": {
                          "argumentTypes": null,
                          "hexValue": "31",
                          "id": 856,
                          "isConstant": false,
                          "isLValue": false,
                          "isPure": true,
                          "kind": "number",
                          "lValueRequested": false,
                          "nodeType": "Literal",
                          "src": "483:1:2",
                          "subdenomination": null,
                          "typeDescriptions": {
                            "typeIdentifier": "t_rational_1_by_1",
                            "typeString": "int_const 1"
                          },
                          "value": "1"
                        },
                        "isConstant": false,
                        "isLValue": true,
                        "isPure": false,
                        "lValueRequested": true,
                        "nodeType": "IndexAccess",
                        "src": "472:13:2",
                        "typeDescriptions": {
                          "typeIdentifier": "t_uint256",
                          "typeString": "uint256"
                        }
                      },
                      "nodeType": "Assignment",
                      "operator": "=",
                      "rightHandSide": {
                        "argumentTypes": null,
                        "expression": {
                          "argumentTypes": null,
                          "id": 858,
                          "name": "xG",
                          "nodeType": "Identifier",
                          "overloadedDeclarations": [],
                          "referencedDeclaration": 835,
                          "src": "488:2:2",
                          "typeDescriptions": {
                            "typeIdentifier": "t_struct$_G1Point_$21_memory_ptr",
                            "typeString": "struct Curve.G1Point memory"
                          }
                        },
                        "id": 859,
                        "isConstant": false,
                        "isLValue": true,
                        "isPure": false,
                        "lValueRequested": false,
                        "memberName": "Y",
                        "nodeType": "MemberAccess",
                        "referencedDeclaration": 20,
                        "src": "488:4:2",
                        "typeDescriptions": {
                          "typeIdentifier": "t_uint256",
                          "typeString": "uint256"
                        }
                      },
                      "src": "472:20:2",
                      "typeDescriptions": {
                        "typeIdentifier": "t_uint256",
                        "typeString": "uint256"
                      }
                    },
                    "id": 861,
                    "nodeType": "ExpressionStatement",
                    "src": "472:20:2"
                  },
                  {
                    "assignments": [
                      863
                    ],
                    "declarations": [
                      {
                        "constant": false,
                        "id": 863,
                        "name": "k",
                        "nodeType": "VariableDeclaration",
                        "scope": 920,
                        "src": "497:9:2",
                        "stateVariable": false,
                        "storageLocation": "default",
                        "typeDescriptions": {
                          "typeIdentifier": "t_uint256",
                          "typeString": "uint256"
                        },
                        "typeName": {
                          "id": 862,
                          "name": "uint256",
                          "nodeType": "ElementaryTypeName",
                          "src": "497:7:2",
                          "typeDescriptions": {
                            "typeIdentifier": "t_uint256",
                            "typeString": "uint256"
                          }
                        },
                        "value": null,
                        "visibility": "internal"
                      }
                    ],
                    "id": 874,
                    "initialValue": {
                      "argumentTypes": null,
                      "commonType": {
                        "typeIdentifier": "t_uint256",
                        "typeString": "uint256"
                      },
                      "id": 873,
                      "isConstant": false,
                      "isLValue": false,
                      "isPure": false,
                      "lValueRequested": false,
                      "leftExpression": {
                        "argumentTypes": null,
                        "arguments": [
                          {
                            "argumentTypes": null,
                            "arguments": [
                              {
                                "argumentTypes": null,
                                "id": 866,
                                "name": "message",
                                "nodeType": "Identifier",
                                "overloadedDeclarations": [],
                                "referencedDeclaration": 821,
                                "src": "527:7:2",
                                "typeDescriptions": {
                                  "typeIdentifier": "t_uint256",
                                  "typeString": "uint256"
                                }
                              },
                              {
                                "argumentTypes": null,
                                "id": 867,
                                "name": "secret",
                                "nodeType": "Identifier",
                                "overloadedDeclarations": [],
                                "referencedDeclaration": 819,
                                "src": "536:6:2",
                                "typeDescriptions": {
                                  "typeIdentifier": "t_uint256",
                                  "typeString": "uint256"
                                }
                              }
                            ],
                            "expression": {
                              "argumentTypes": [
                                {
                                  "typeIdentifier": "t_uint256",
                                  "typeString": "uint256"
                                },
                                {
                                  "typeIdentifier": "t_uint256",
                                  "typeString": "uint256"
                                }
                              ],
                              "id": 865,
                              "name": "keccak256",
                              "nodeType": "Identifier",
                              "overloadedDeclarations": [],
                              "referencedDeclaration": 1028,
                              "src": "517:9:2",
                              "typeDescriptions": {
                                "typeIdentifier": "t_function_sha3_pure$__$returns$_t_bytes32_$",
                                "typeString": "function () pure returns (bytes32)"
                              }
                            },
                            "id": 868,
                            "isConstant": false,
                            "isLValue": false,
                            "isPure": false,
                            "kind": "functionCall",
                            "lValueRequested": false,
                            "names": [],
                            "nodeType": "FunctionCall",
                            "src": "517:26:2",
                            "typeDescriptions": {
                              "typeIdentifier": "t_bytes32",
                              "typeString": "bytes32"
                            }
                          }
                        ],
                        "expression": {
                          "argumentTypes": [
                            {
                              "typeIdentifier": "t_bytes32",
                              "typeString": "bytes32"
                            }
                          ],
                          "id": 864,
                          "isConstant": false,
                          "isLValue": false,
                          "isPure": true,
                          "lValueRequested": false,
                          "nodeType": "ElementaryTypeNameExpression",
                          "src": "509:7:2",
                          "typeDescriptions": {
                            "typeIdentifier": "t_type$_t_uint256_$",
                            "typeString": "type(uint256)"
                          },
                          "typeName": "uint256"
                        },
                        "id": 869,
                        "isConstant": false,
                        "isLValue": false,
                        "isPure": false,
                        "kind": "typeConversion",
                        "lValueRequested": false,
                        "names": [],
                        "nodeType": "FunctionCall",
                        "src": "509:35:2",
                        "typeDescriptions": {
                          "typeIdentifier": "t_uint256",
                          "typeString": "uint256"
                        }
                      },
                      "nodeType": "BinaryOperation",
                      "operator": "%",
                      "rightExpression": {
                        "argumentTypes": null,
                        "arguments": [],
                        "expression": {
                          "argumentTypes": [],
                          "expression": {
                            "argumentTypes": null,
                            "id": 870,
                            "name": "Curve",
                            "nodeType": "Identifier",
                            "overloadedDeclarations": [],
                            "referencedDeclaration": 814,
                            "src": "547:5:2",
                            "typeDescriptions": {
                              "typeIdentifier": "t_type$_t_contract$_Curve_$814_$",
                              "typeString": "type(library Curve)"
                            }
                          },
                          "id": 871,
                          "isConstant": false,
                          "isLValue": false,
                          "isPure": false,
                          "lValueRequested": false,
                          "memberName": "N",
                          "nodeType": "MemberAccess",
                          "referencedDeclaration": 54,
                          "src": "547:7:2",
                          "typeDescriptions": {
                            "typeIdentifier": "t_function_internal_pure$__$returns$_t_uint256_$",
                            "typeString": "function () pure returns (uint256)"
                          }
                        },
                        "id": 872,
                        "isConstant": false,
                        "isLValue": false,
                        "isPure": false,
                        "kind": "functionCall",
                        "lValueRequested": false,
                        "names": [],
                        "nodeType": "FunctionCall",
                        "src": "547:9:2",
                        "typeDescriptions": {
                          "typeIdentifier": "t_uint256",
                          "typeString": "uint256"
                        }
                      },
                      "src": "509:47:2",
                      "typeDescriptions": {
                        "typeIdentifier": "t_uint256",
                        "typeString": "uint256"
                      }
                    },
                    "nodeType": "VariableDeclarationStatement",
                    "src": "497:59:2"
                  },
                  {
                    "assignments": [
                      878
                    ],
                    "declarations": [
                      {
                        "constant": false,
                        "id": 878,
                        "name": "kG",
                        "nodeType": "VariableDeclaration",
                        "scope": 920,
                        "src": "561:23:2",
                        "stateVariable": false,
                        "storageLocation": "memory",
                        "typeDescriptions": {
                          "typeIdentifier": "t_struct$_G1Point_$21_memory_ptr",
                          "typeString": "struct Curve.G1Point memory"
                        },
                        "typeName": {
                          "contractScope": null,
                          "id": 877,
                          "name": "Curve.G1Point",
                          "nodeType": "UserDefinedTypeName",
                          "referencedDeclaration": 21,
                          "src": "561:13:2",
                          "typeDescriptions": {
                            "typeIdentifier": "t_struct$_G1Point_$21_storage_ptr",
                            "typeString": "struct Curve.G1Point storage pointer"
                          }
                        },
                        "value": null,
                        "visibility": "internal"
                      }
                    ],
                    "id": 886,
                    "initialValue": {
                      "argumentTypes": null,
                      "arguments": [
                        {
                          "argumentTypes": null,
                          "arguments": [],
                          "expression": {
                            "argumentTypes": [],
                            "expression": {
                              "argumentTypes": null,
                              "id": 881,
                              "name": "Curve",
                              "nodeType": "Identifier",
                              "overloadedDeclarations": [],
                              "referencedDeclaration": 814,
                              "src": "599:5:2",
                              "typeDescriptions": {
                                "typeIdentifier": "t_type$_t_contract$_Curve_$814_$",
                                "typeString": "type(library Curve)"
                              }
                            },
                            "id": 882,
                            "isConstant": false,
                            "isLValue": false,
                            "isPure": false,
                            "lValueRequested": false,
                            "memberName": "P1",
                            "nodeType": "MemberAccess",
                            "referencedDeclaration": 65,
                            "src": "599:8:2",
                            "typeDescriptions": {
                              "typeIdentifier": "t_function_internal_pure$__$returns$_t_struct$_G1Point_$21_memory_ptr_$",
                              "typeString": "function () pure returns (struct Curve.G1Point memory)"
                            }
                          },
                          "id": 883,
                          "isConstant": false,
                          "isLValue": false,
                          "isPure": false,
                          "kind": "functionCall",
                          "lValueRequested": false,
                          "names": [],
                          "nodeType": "FunctionCall",
                          "src": "599:10:2",
                          "typeDescriptions": {
                            "typeIdentifier": "t_struct$_G1Point_$21_memory_ptr",
                            "typeString": "struct Curve.G1Point memory"
                          }
                        },
                        {
                          "argumentTypes": null,
                          "id": 884,
                          "name": "k",
                          "nodeType": "Identifier",
                          "overloadedDeclarations": [],
                          "referencedDeclaration": 863,
                          "src": "611:1:2",
                          "typeDescriptions": {
                            "typeIdentifier": "t_uint256",
                            "typeString": "uint256"
                          }
                        }
                      ],
                      "expression": {
                        "argumentTypes": [
                          {
                            "typeIdentifier": "t_struct$_G1Point_$21_memory_ptr",
                            "typeString": "struct Curve.G1Point memory"
                          },
                          {
                            "typeIdentifier": "t_uint256",
                            "typeString": "uint256"
                          }
                        ],
                        "expression": {
                          "argumentTypes": null,
                          "id": 879,
                          "name": "Curve",
                          "nodeType": "Identifier",
                          "overloadedDeclarations": [],
                          "referencedDeclaration": 814,
                          "src": "587:5:2",
                          "typeDescriptions": {
                            "typeIdentifier": "t_type$_t_contract$_Curve_$814_$",
                            "typeString": "type(library Curve)"
                          }
                        },
                        "id": 880,
                        "isConstant": false,
                        "isLValue": false,
                        "isPure": false,
                        "lValueRequested": false,
                        "memberName": "g1mul",
                        "nodeType": "MemberAccess",
                        "referencedDeclaration": 417,
                        "src": "587:11:2",
                        "typeDescriptions": {
                          "typeIdentifier": "t_function_internal_view$_t_struct$_G1Point_$21_memory_ptr_$_t_uint256_$returns$_t_struct$_G1Point_$21_memory_ptr_$",
                          "typeString": "function (struct Curve.G1Point memory,uint256) view returns (struct Curve.G1Point memory)"
                        }
                      },
                      "id": 885,
                      "isConstant": false,
                      "isLValue": false,
                      "isPure": false,
                      "kind": "functionCall",
                      "lValueRequested": false,
                      "names": [],
                      "nodeType": "FunctionCall",
                      "src": "587:26:2",
                      "typeDescriptions": {
                        "typeIdentifier": "t_struct$_G1Point_$21_memory_ptr",
                        "typeString": "struct Curve.G1Point memory"
                      }
                    },
                    "nodeType": "VariableDeclarationStatement",
                    "src": "561:52:2"
                  },
                  {
                    "expression": {
                      "argumentTypes": null,
                      "id": 903,
                      "isConstant": false,
                      "isLValue": false,
                      "isPure": false,
                      "lValueRequested": false,
                      "leftHandSide": {
                        "argumentTypes": null,
                        "id": 887,
                        "name": "out_e",
                        "nodeType": "Identifier",
                        "overloadedDeclarations": [],
                        "referencedDeclaration": 830,
                        "src": "618:5:2",
                        "typeDescriptions": {
                          "typeIdentifier": "t_uint256",
                          "typeString": "uint256"
                        }
                      },
                      "nodeType": "Assignment",
                      "operator": "=",
                      "rightHandSide": {
                        "argumentTypes": null,
                        "arguments": [
                          {
                            "argumentTypes": null,
                            "arguments": [
                              {
                                "argumentTypes": null,
                                "baseExpression": {
                                  "argumentTypes": null,
                                  "id": 890,
                                  "name": "out_pubkey",
                                  "nodeType": "Identifier",
                                  "overloadedDeclarations": [],
                                  "referencedDeclaration": 826,
                                  "src": "644:10:2",
                                  "typeDescriptions": {
                                    "typeIdentifier": "t_array$_t_uint256_$2_memory_ptr",
                                    "typeString": "uint256[2] memory"
                                  }
                                },
                                "id": 892,
                                "indexExpression": {
                                  "argumentTypes": null,
                                  "hexValue": "30",
                                  "id": 891,
                                  "isConstant": false,
                                  "isLValue": false,
                                  "isPure": true,
                                  "kind": "number",
                                  "lValueRequested": false,
                                  "nodeType": "Literal",
                                  "src": "655:1:2",
                                  "subdenomination": null,
                                  "typeDescriptions": {
                                    "typeIdentifier": "t_rational_0_by_1",
                                    "typeString": "int_const 0"
                                  },
                                  "value": "0"
                                },
                                "isConstant": false,
                                "isLValue": true,
                                "isPure": false,
                                "lValueRequested": false,
                                "nodeType": "IndexAccess",
                                "src": "644:13:2",
                                "typeDescriptions": {
                                  "typeIdentifier": "t_uint256",
                                  "typeString": "uint256"
                                }
                              },
                              {
                                "argumentTypes": null,
                                "baseExpression": {
                                  "argumentTypes": null,
                                  "id": 893,
                                  "name": "out_pubkey",
                                  "nodeType": "Identifier",
                                  "overloadedDeclarations": [],
                                  "referencedDeclaration": 826,
                                  "src": "659:10:2",
                                  "typeDescriptions": {
                                    "typeIdentifier": "t_array$_t_uint256_$2_memory_ptr",
                                    "typeString": "uint256[2] memory"
                                  }
                                },
                                "id": 895,
                                "indexExpression": {
                                  "argumentTypes": null,
                                  "hexValue": "31",
                                  "id": 894,
                                  "isConstant": false,
                                  "isLValue": false,
                                  "isPure": true,
                                  "kind": "number",
                                  "lValueRequested": false,
                                  "nodeType": "Literal",
                                  "src": "670:1:2",
                                  "subdenomination": null,
                                  "typeDescriptions": {
                                    "typeIdentifier": "t_rational_1_by_1",
                                    "typeString": "int_const 1"
                                  },
                                  "value": "1"
                                },
                                "isConstant": false,
                                "isLValue": true,
                                "isPure": false,
                                "lValueRequested": false,
                                "nodeType": "IndexAccess",
                                "src": "659:13:2",
                                "typeDescriptions": {
                                  "typeIdentifier": "t_uint256",
                                  "typeString": "uint256"
                                }
                              },
                              {
                                "argumentTypes": null,
                                "expression": {
                                  "argumentTypes": null,
                                  "id": 896,
                                  "name": "kG",
                                  "nodeType": "Identifier",
                                  "overloadedDeclarations": [],
                                  "referencedDeclaration": 878,
                                  "src": "674:2:2",
                                  "typeDescriptions": {
                                    "typeIdentifier": "t_struct$_G1Point_$21_memory_ptr",
                                    "typeString": "struct Curve.G1Point memory"
                                  }
                                },
                                "id": 897,
                                "isConstant": false,
                                "isLValue": true,
                                "isPure": false,
                                "lValueRequested": false,
                                "memberName": "X",
                                "nodeType": "MemberAccess",
                                "referencedDeclaration": 18,
                                "src": "674:4:2",
                                "typeDescriptions": {
                                  "typeIdentifier": "t_uint256",
                                  "typeString": "uint256"
                                }
                              },
                              {
                                "argumentTypes": null,
                                "expression": {
                                  "argumentTypes": null,
                                  "id": 898,
                                  "name": "kG",
                                  "nodeType": "Identifier",
                                  "overloadedDeclarations": [],
                                  "referencedDeclaration": 878,
                                  "src": "680:2:2",
                                  "typeDescriptions": {
                                    "typeIdentifier": "t_struct$_G1Point_$21_memory_ptr",
                                    "typeString": "struct Curve.G1Point memory"
                                  }
                                },
                                "id": 899,
                                "isConstant": false,
                                "isLValue": true,
                                "isPure": false,
                                "lValueRequested": false,
                                "memberName": "Y",
                                "nodeType": "MemberAccess",
                                "referencedDeclaration": 20,
                                "src": "680:4:2",
                                "typeDescriptions": {
                                  "typeIdentifier": "t_uint256",
                                  "typeString": "uint256"
                                }
                              },
                              {
                                "argumentTypes": null,
                                "id": 900,
                                "name": "message",
                                "nodeType": "Identifier",
                                "overloadedDeclarations": [],
                                "referencedDeclaration": 821,
                                "src": "686:7:2",
                                "typeDescriptions": {
                                  "typeIdentifier": "t_uint256",
                                  "typeString": "uint256"
                                }
                              }
                            ],
                            "expression": {
                              "argumentTypes": [
                                {
                                  "typeIdentifier": "t_uint256",
                                  "typeString": "uint256"
                                },
                                {
                                  "typeIdentifier": "t_uint256",
                                  "typeString": "uint256"
                                },
                                {
                                  "typeIdentifier": "t_uint256",
                                  "typeString": "uint256"
                                },
                                {
                                  "typeIdentifier": "t_uint256",
                                  "typeString": "uint256"
                                },
                                {
                                  "typeIdentifier": "t_uint256",
                                  "typeString": "uint256"
                                }
                              ],
                              "id": 889,
                              "name": "keccak256",
                              "nodeType": "Identifier",
                              "overloadedDeclarations": [],
                              "referencedDeclaration": 1028,
                              "src": "634:9:2",
                              "typeDescriptions": {
                                "typeIdentifier": "t_function_sha3_pure$__$returns$_t_bytes32_$",
                                "typeString": "function () pure returns (bytes32)"
                              }
                            },
                            "id": 901,
                            "isConstant": false,
                            "isLValue": false,
                            "isPure": false,
                            "kind": "functionCall",
                            "lValueRequested": false,
                            "names": [],
                            "nodeType": "FunctionCall",
                            "src": "634:60:2",
                            "typeDescriptions": {
                              "typeIdentifier": "t_bytes32",
                              "typeString": "bytes32"
                            }
                          }
                        ],
                        "expression": {
                          "argumentTypes": [
                            {
                              "typeIdentifier": "t_bytes32",
                              "typeString": "bytes32"
                            }
                          ],
                          "id": 888,
                          "isConstant": false,
                          "isLValue": false,
                          "isPure": true,
                          "lValueRequested": false,
                          "nodeType": "ElementaryTypeNameExpression",
                          "src": "626:7:2",
                          "typeDescriptions": {
                            "typeIdentifier": "t_type$_t_uint256_$",
                            "typeString": "type(uint256)"
                          },
                          "typeName": "uint256"
                        },
                        "id": 902,
                        "isConstant": false,
                        "isLValue": false,
                        "isPure": false,
                        "kind": "typeConversion",
                        "lValueRequested": false,
                        "names": [],
                        "nodeType": "FunctionCall",
                        "src": "626:69:2",
                        "typeDescriptions": {
                          "typeIdentifier": "t_uint256",
                          "typeString": "uint256"
                        }
                      },
                      "src": "618:77:2",
                      "typeDescriptions": {
                        "typeIdentifier": "t_uint256",
                        "typeString": "uint256"
                      }
                    },
                    "id": 904,
                    "nodeType": "ExpressionStatement",
                    "src": "618:77:2"
                  },
                  {
                    "expression": {
                      "argumentTypes": null,
                      "id": 917,
                      "isConstant": false,
                      "isLValue": false,
                      "isPure": false,
                      "lValueRequested": false,
                      "leftHandSide": {
                        "argumentTypes": null,
                        "id": 905,
                        "name": "out_s",
                        "nodeType": "Identifier",
                        "overloadedDeclarations": [],
                        "referencedDeclaration": 828,
                        "src": "700:5:2",
                        "typeDescriptions": {
                          "typeIdentifier": "t_uint256",
                          "typeString": "uint256"
                        }
                      },
                      "nodeType": "Assignment",
                      "operator": "=",
                      "rightHandSide": {
                        "argumentTypes": null,
                        "arguments": [
                          {
                            "argumentTypes": null,
                            "id": 908,
                            "name": "k",
                            "nodeType": "Identifier",
                            "overloadedDeclarations": [],
                            "referencedDeclaration": 863,
                            "src": "721:1:2",
                            "typeDescriptions": {
                              "typeIdentifier": "t_uint256",
                              "typeString": "uint256"
                            }
                          },
                          {
                            "argumentTypes": null,
                            "arguments": [
                              {
                                "argumentTypes": null,
                                "id": 910,
                                "name": "secret",
                                "nodeType": "Identifier",
                                "overloadedDeclarations": [],
                                "referencedDeclaration": 819,
                                "src": "731:6:2",
                                "typeDescriptions": {
                                  "typeIdentifier": "t_uint256",
                                  "typeString": "uint256"
                                }
                              },
                              {
                                "argumentTypes": null,
                                "id": 911,
                                "name": "out_e",
                                "nodeType": "Identifier",
                                "overloadedDeclarations": [],
                                "referencedDeclaration": 830,
                                "src": "739:5:2",
                                "typeDescriptions": {
                                  "typeIdentifier": "t_uint256",
                                  "typeString": "uint256"
                                }
                              },
                              {
                                "argumentTypes": null,
                                "arguments": [],
                                "expression": {
                                  "argumentTypes": [],
                                  "expression": {
                                    "argumentTypes": null,
                                    "id": 912,
                                    "name": "Curve",
                                    "nodeType": "Identifier",
                                    "overloadedDeclarations": [],
                                    "referencedDeclaration": 814,
                                    "src": "746:5:2",
                                    "typeDescriptions": {
                                      "typeIdentifier": "t_type$_t_contract$_Curve_$814_$",
                                      "typeString": "type(library Curve)"
                                    }
                                  },
                                  "id": 913,
                                  "isConstant": false,
                                  "isLValue": false,
                                  "isPure": false,
                                  "lValueRequested": false,
                                  "memberName": "N",
                                  "nodeType": "MemberAccess",
                                  "referencedDeclaration": 54,
                                  "src": "746:7:2",
                                  "typeDescriptions": {
                                    "typeIdentifier": "t_function_internal_pure$__$returns$_t_uint256_$",
                                    "typeString": "function () pure returns (uint256)"
                                  }
                                },
                                "id": 914,
                                "isConstant": false,
                                "isLValue": false,
                                "isPure": false,
                                "kind": "functionCall",
                                "lValueRequested": false,
                                "names": [],
                                "nodeType": "FunctionCall",
                                "src": "746:9:2",
                                "typeDescriptions": {
                                  "typeIdentifier": "t_uint256",
                                  "typeString": "uint256"
                                }
                              }
                            ],
                            "expression": {
                              "argumentTypes": [
                                {
                                  "typeIdentifier": "t_uint256",
                                  "typeString": "uint256"
                                },
                                {
                                  "typeIdentifier": "t_uint256",
                                  "typeString": "uint256"
                                },
                                {
                                  "typeIdentifier": "t_uint256",
                                  "typeString": "uint256"
                                }
                              ],
                              "id": 909,
                              "name": "mulmod",
                              "nodeType": "Identifier",
                              "overloadedDeclarations": [],
                              "referencedDeclaration": 1035,
                              "src": "724:6:2",
                              "typeDescriptions": {
                                "typeIdentifier": "t_function_mulmod_pure$_t_uint256_$_t_uint256_$_t_uint256_$returns$_t_uint256_$",
                                "typeString": "function (uint256,uint256,uint256) pure returns (uint256)"
                              }
                            },
                            "id": 915,
                            "isConstant": false,
                            "isLValue": false,
                            "isPure": false,
                            "kind": "functionCall",
                            "lValueRequested": false,
                            "names": [],
                            "nodeType": "FunctionCall",
                            "src": "724:32:2",
                            "typeDescriptions": {
                              "typeIdentifier": "t_uint256",
                              "typeString": "uint256"
                            }
                          }
                        ],
                        "expression": {
                          "argumentTypes": [
                            {
                              "typeIdentifier": "t_uint256",
                              "typeString": "uint256"
                            },
                            {
                              "typeIdentifier": "t_uint256",
                              "typeString": "uint256"
                            }
                          ],
                          "expression": {
                            "argumentTypes": null,
                            "id": 906,
                            "name": "Curve",
                            "nodeType": "Identifier",
                            "overloadedDeclarations": [],
                            "referencedDeclaration": 814,
                            "src": "708:5:2",
                            "typeDescriptions": {
                              "typeIdentifier": "t_type$_t_contract$_Curve_$814_$",
                              "typeString": "type(library Curve)"
                            }
                          },
                          "id": 907,
                          "isConstant": false,
                          "isLValue": false,
                          "isPure": false,
                          "lValueRequested": false,
                          "memberName": "submod",
                          "nodeType": "MemberAccess",
                          "referencedDeclaration": 195,
                          "src": "708:12:2",
                          "typeDescriptions": {
                            "typeIdentifier": "t_function_internal_pure$_t_uint256_$_t_uint256_$returns$_t_uint256_$",
                            "typeString": "function (uint256,uint256) pure returns (uint256)"
                          }
                        },
                        "id": 916,
                        "isConstant": false,
                        "isLValue": false,
                        "isPure": false,
                        "kind": "functionCall",
                        "lValueRequested": false,
                        "names": [],
                        "nodeType": "FunctionCall",
                        "src": "708:49:2",
                        "typeDescriptions": {
                          "typeIdentifier": "t_uint256",
                          "typeString": "uint256"
                        }
                      },
                      "src": "700:57:2",
                      "typeDescriptions": {
                        "typeIdentifier": "t_uint256",
                        "typeString": "uint256"
                      }
                    },
                    "id": 918,
                    "nodeType": "ExpressionStatement",
                    "src": "700:57:2"
                  }
                ]
              },
              "id": 920,
              "implemented": true,
              "isConstructor": false,
              "isDeclaredConst": true,
              "modifiers": [],
              "name": "CreateProof",
              "nodeType": "FunctionDefinition",
              "parameters": {
                "id": 822,
                "nodeType": "ParameterList",
                "parameters": [
                  {
                    "constant": false,
                    "id": 819,
                    "name": "secret",
                    "nodeType": "VariableDeclaration",
                    "scope": 920,
                    "src": "240:14:2",
                    "stateVariable": false,
                    "storageLocation": "default",
                    "typeDescriptions": {
                      "typeIdentifier": "t_uint256",
                      "typeString": "uint256"
                    },
                    "typeName": {
                      "id": 818,
                      "name": "uint256",
                      "nodeType": "ElementaryTypeName",
                      "src": "240:7:2",
                      "typeDescriptions": {
                        "typeIdentifier": "t_uint256",
                        "typeString": "uint256"
                      }
                    },
                    "value": null,
                    "visibility": "internal"
                  },
                  {
                    "constant": false,
                    "id": 821,
                    "name": "message",
                    "nodeType": "VariableDeclaration",
                    "scope": 920,
                    "src": "256:15:2",
                    "stateVariable": false,
                    "storageLocation": "default",
                    "typeDescriptions": {
                      "typeIdentifier": "t_uint256",
                      "typeString": "uint256"
                    },
                    "typeName": {
                      "id": 820,
                      "name": "uint256",
                      "nodeType": "ElementaryTypeName",
                      "src": "256:7:2",
                      "typeDescriptions": {
                        "typeIdentifier": "t_uint256",
                        "typeString": "uint256"
                      }
                    },
                    "value": null,
                    "visibility": "internal"
                  }
                ],
                "src": "238:35:2"
              },
              "payable": false,
              "returnParameters": {
                "id": 831,
                "nodeType": "ParameterList",
                "parameters": [
                  {
                    "constant": false,
                    "id": 826,
                    "name": "out_pubkey",
                    "nodeType": "VariableDeclaration",
                    "scope": 920,
                    "src": "313:21:2",
                    "stateVariable": false,
                    "storageLocation": "default",
                    "typeDescriptions": {
                      "typeIdentifier": "t_array$_t_uint256_$2_memory_ptr",
                      "typeString": "uint256[2] memory"
                    },
                    "typeName": {
                      "baseType": {
                        "id": 823,
                        "name": "uint256",
                        "nodeType": "ElementaryTypeName",
                        "src": "313:7:2",
                        "typeDescriptions": {
                          "typeIdentifier": "t_uint256",
                          "typeString": "uint256"
                        }
                      },
                      "id": 825,
                      "length": {
                        "argumentTypes": null,
                        "hexValue": "32",
                        "id": 824,
                        "isConstant": false,
                        "isLValue": false,
                        "isPure": false,
                        "kind": "number",
                        "lValueRequested": false,
                        "nodeType": "Literal",
                        "src": "321:1:2",
                        "subdenomination": null,
                        "typeDescriptions": {
                          "typeIdentifier": "t_rational_2_by_1",
                          "typeString": "int_const 2"
                        },
                        "value": "2"
                      },
                      "nodeType": "ArrayTypeName",
                      "src": "313:10:2",
                      "typeDescriptions": {
                        "typeIdentifier": "t_array$_t_uint256_$2_storage_ptr",
                        "typeString": "uint256[2] storage pointer"
                      }
                    },
                    "value": null,
                    "visibility": "internal"
                  },
                  {
                    "constant": false,
                    "id": 828,
                    "name": "out_s",
                    "nodeType": "VariableDeclaration",
                    "scope": 920,
                    "src": "336:13:2",
                    "stateVariable": false,
                    "storageLocation": "default",
                    "typeDescriptions": {
                      "typeIdentifier": "t_uint256",
                      "typeString": "uint256"
                    },
                    "typeName": {
                      "id": 827,
                      "name": "uint256",
                      "nodeType": "ElementaryTypeName",
                      "src": "336:7:2",
                      "typeDescriptions": {
                        "typeIdentifier": "t_uint256",
                        "typeString": "uint256"
                      }
                    },
                    "value": null,
                    "visibility": "internal"
                  },
                  {
                    "constant": false,
                    "id": 830,
                    "name": "out_e",
                    "nodeType": "VariableDeclaration",
                    "scope": 920,
                    "src": "351:13:2",
                    "stateVariable": false,
                    "storageLocation": "default",
                    "typeDescriptions": {
                      "typeIdentifier": "t_uint256",
                      "typeString": "uint256"
                    },
                    "typeName": {
                      "id": 829,
                      "name": "uint256",
                      "nodeType": "ElementaryTypeName",
                      "src": "351:7:2",
                      "typeDescriptions": {
                        "typeIdentifier": "t_uint256",
                        "typeString": "uint256"
                      }
                    },
                    "value": null,
                    "visibility": "internal"
                  }
                ],
                "src": "312:53:2"
              },
              "scope": 1022,
              "src": "218:544:2",
              "stateMutability": "view",
              "superFunction": null,
              "visibility": "internal"
            },
            {
              "body": {
                "id": 995,
                "nodeType": "Block",
                "src": "957:291:2",
                "statements": [
                  {
                    "assignments": [
                      938
                    ],
                    "declarations": [
                      {
                        "constant": false,
                        "id": 938,
                        "name": "sG",
                        "nodeType": "VariableDeclaration",
                        "scope": 996,
                        "src": "965:23:2",
                        "stateVariable": false,
                        "storageLocation": "memory",
                        "typeDescriptions": {
                          "typeIdentifier": "t_struct$_G1Point_$21_memory_ptr",
                          "typeString": "struct Curve.G1Point memory"
                        },
                        "typeName": {
                          "contractScope": null,
                          "id": 937,
                          "name": "Curve.G1Point",
                          "nodeType": "UserDefinedTypeName",
                          "referencedDeclaration": 21,
                          "src": "965:13:2",
                          "typeDescriptions": {
                            "typeIdentifier": "t_struct$_G1Point_$21_storage_ptr",
                            "typeString": "struct Curve.G1Point storage pointer"
                          }
                        },
                        "value": null,
                        "visibility": "internal"
                      }
                    ],
                    "id": 950,
                    "initialValue": {
                      "argumentTypes": null,
                      "arguments": [
                        {
                          "argumentTypes": null,
                          "arguments": [],
                          "expression": {
                            "argumentTypes": [],
                            "expression": {
                              "argumentTypes": null,
                              "id": 941,
                              "name": "Curve",
                              "nodeType": "Identifier",
                              "overloadedDeclarations": [],
                              "referencedDeclaration": 814,
                              "src": "1003:5:2",
                              "typeDescriptions": {
                                "typeIdentifier": "t_type$_t_contract$_Curve_$814_$",
                                "typeString": "type(library Curve)"
                              }
                            },
                            "id": 942,
                            "isConstant": false,
                            "isLValue": false,
                            "isPure": false,
                            "lValueRequested": false,
                            "memberName": "P1",
                            "nodeType": "MemberAccess",
                            "referencedDeclaration": 65,
                            "src": "1003:8:2",
                            "typeDescriptions": {
                              "typeIdentifier": "t_function_internal_pure$__$returns$_t_struct$_G1Point_$21_memory_ptr_$",
                              "typeString": "function () pure returns (struct Curve.G1Point memory)"
                            }
                          },
                          "id": 943,
                          "isConstant": false,
                          "isLValue": false,
                          "isPure": false,
                          "kind": "functionCall",
                          "lValueRequested": false,
                          "names": [],
                          "nodeType": "FunctionCall",
                          "src": "1003:10:2",
                          "typeDescriptions": {
                            "typeIdentifier": "t_struct$_G1Point_$21_memory_ptr",
                            "typeString": "struct Curve.G1Point memory"
                          }
                        },
                        {
                          "argumentTypes": null,
                          "commonType": {
                            "typeIdentifier": "t_uint256",
                            "typeString": "uint256"
                          },
                          "id": 948,
                          "isConstant": false,
                          "isLValue": false,
                          "isPure": false,
                          "lValueRequested": false,
                          "leftExpression": {
                            "argumentTypes": null,
                            "id": 944,
                            "name": "s",
                            "nodeType": "Identifier",
                            "overloadedDeclarations": [],
                            "referencedDeclaration": 928,
                            "src": "1015:1:2",
                            "typeDescriptions": {
                              "typeIdentifier": "t_uint256",
                              "typeString": "uint256"
                            }
                          },
                          "nodeType": "BinaryOperation",
                          "operator": "%",
                          "rightExpression": {
                            "argumentTypes": null,
                            "arguments": [],
                            "expression": {
                              "argumentTypes": [],
                              "expression": {
                                "argumentTypes": null,
                                "id": 945,
                                "name": "Curve",
                                "nodeType": "Identifier",
                                "overloadedDeclarations": [],
                                "referencedDeclaration": 814,
                                "src": "1019:5:2",
                                "typeDescriptions": {
                                  "typeIdentifier": "t_type$_t_contract$_Curve_$814_$",
                                  "typeString": "type(library Curve)"
                                }
                              },
                              "id": 946,
                              "isConstant": false,
                              "isLValue": false,
                              "isPure": false,
                              "lValueRequested": false,
                              "memberName": "N",
                              "nodeType": "MemberAccess",
                              "referencedDeclaration": 54,
                              "src": "1019:7:2",
                              "typeDescriptions": {
                                "typeIdentifier": "t_function_internal_pure$__$returns$_t_uint256_$",
                                "typeString": "function () pure returns (uint256)"
                              }
                            },
                            "id": 947,
                            "isConstant": false,
                            "isLValue": false,
                            "isPure": false,
                            "kind": "functionCall",
                            "lValueRequested": false,
                            "names": [],
                            "nodeType": "FunctionCall",
                            "src": "1019:9:2",
                            "typeDescriptions": {
                              "typeIdentifier": "t_uint256",
                              "typeString": "uint256"
                            }
                          },
                          "src": "1015:13:2",
                          "typeDescriptions": {
                            "typeIdentifier": "t_uint256",
                            "typeString": "uint256"
                          }
                        }
                      ],
                      "expression": {
                        "argumentTypes": [
                          {
                            "typeIdentifier": "t_struct$_G1Point_$21_memory_ptr",
                            "typeString": "struct Curve.G1Point memory"
                          },
                          {
                            "typeIdentifier": "t_uint256",
                            "typeString": "uint256"
                          }
                        ],
                        "expression": {
                          "argumentTypes": null,
                          "id": 939,
                          "name": "Curve",
                          "nodeType": "Identifier",
                          "overloadedDeclarations": [],
                          "referencedDeclaration": 814,
                          "src": "991:5:2",
                          "typeDescriptions": {
                            "typeIdentifier": "t_type$_t_contract$_Curve_$814_$",
                            "typeString": "type(library Curve)"
                          }
                        },
                        "id": 940,
                        "isConstant": false,
                        "isLValue": false,
                        "isPure": false,
                        "lValueRequested": false,
                        "memberName": "g1mul",
                        "nodeType": "MemberAccess",
                        "referencedDeclaration": 417,
                        "src": "991:11:2",
                        "typeDescriptions": {
                          "typeIdentifier": "t_function_internal_view$_t_struct$_G1Point_$21_memory_ptr_$_t_uint256_$returns$_t_struct$_G1Point_$21_memory_ptr_$",
                          "typeString": "function (struct Curve.G1Point memory,uint256) view returns (struct Curve.G1Point memory)"
                        }
                      },
                      "id": 949,
                      "isConstant": false,
                      "isLValue": false,
                      "isPure": false,
                      "kind": "functionCall",
                      "lValueRequested": false,
                      "names": [],
                      "nodeType": "FunctionCall",
                      "src": "991:38:2",
                      "typeDescriptions": {
                        "typeIdentifier": "t_struct$_G1Point_$21_memory_ptr",
                        "typeString": "struct Curve.G1Point memory"
                      }
                    },
                    "nodeType": "VariableDeclarationStatement",
                    "src": "965:64:2"
                  },
                  {
                    "assignments": [
                      954
                    ],
                    "declarations": [
                      {
                        "constant": false,
                        "id": 954,
                        "name": "xG",
                        "nodeType": "VariableDeclaration",
                        "scope": 996,
                        "src": "1037:23:2",
                        "stateVariable": false,
                        "storageLocation": "memory",
                        "typeDescriptions": {
                          "typeIdentifier": "t_struct$_G1Point_$21_memory_ptr",
                          "typeString": "struct Curve.G1Point memory"
                        },
                        "typeName": {
                          "contractScope": null,
                          "id": 953,
                          "name": "Curve.G1Point",
                          "nodeType": "UserDefinedTypeName",
                          "referencedDeclaration": 21,
                          "src": "1037:13:2",
                          "typeDescriptions": {
                            "typeIdentifier": "t_struct$_G1Point_$21_storage_ptr",
                            "typeString": "struct Curve.G1Point storage pointer"
                          }
                        },
                        "value": null,
                        "visibility": "internal"
                      }
                    ],
                    "id": 964,
                    "initialValue": {
                      "argumentTypes": null,
                      "arguments": [
                        {
                          "argumentTypes": null,
                          "baseExpression": {
                            "argumentTypes": null,
                            "id": 957,
                            "name": "pubkey",
                            "nodeType": "Identifier",
                            "overloadedDeclarations": [],
                            "referencedDeclaration": 924,
                            "src": "1077:6:2",
                            "typeDescriptions": {
                              "typeIdentifier": "t_array$_t_uint256_$2_memory_ptr",
                              "typeString": "uint256[2] memory"
                            }
                          },
                          "id": 959,
                          "indexExpression": {
                            "argumentTypes": null,
                            "hexValue": "30",
                            "id": 958,
                            "isConstant": false,
                            "isLValue": false,
                            "isPure": true,
                            "kind": "number",
                            "lValueRequested": false,
                            "nodeType": "Literal",
                            "src": "1084:1:2",
                            "subdenomination": null,
                            "typeDescriptions": {
                              "typeIdentifier": "t_rational_0_by_1",
                              "typeString": "int_const 0"
                            },
                            "value": "0"
                          },
                          "isConstant": false,
                          "isLValue": true,
                          "isPure": false,
                          "lValueRequested": false,
                          "nodeType": "IndexAccess",
                          "src": "1077:9:2",
                          "typeDescriptions": {
                            "typeIdentifier": "t_uint256",
                            "typeString": "uint256"
                          }
                        },
                        {
                          "argumentTypes": null,
                          "baseExpression": {
                            "argumentTypes": null,
                            "id": 960,
                            "name": "pubkey",
                            "nodeType": "Identifier",
                            "overloadedDeclarations": [],
                            "referencedDeclaration": 924,
                            "src": "1088:6:2",
                            "typeDescriptions": {
                              "typeIdentifier": "t_array$_t_uint256_$2_memory_ptr",
                              "typeString": "uint256[2] memory"
                            }
                          },
                          "id": 962,
                          "indexExpression": {
                            "argumentTypes": null,
                            "hexValue": "31",
                            "id": 961,
                            "isConstant": false,
                            "isLValue": false,
                            "isPure": true,
                            "kind": "number",
                            "lValueRequested": false,
                            "nodeType": "Literal",
                            "src": "1095:1:2",
                            "subdenomination": null,
                            "typeDescriptions": {
                              "typeIdentifier": "t_rational_1_by_1",
                              "typeString": "int_const 1"
                            },
                            "value": "1"
                          },
                          "isConstant": false,
                          "isLValue": true,
                          "isPure": false,
                          "lValueRequested": false,
                          "nodeType": "IndexAccess",
                          "src": "1088:9:2",
                          "typeDescriptions": {
                            "typeIdentifier": "t_uint256",
                            "typeString": "uint256"
                          }
                        }
                      ],
                      "expression": {
                        "argumentTypes": [
                          {
                            "typeIdentifier": "t_uint256",
                            "typeString": "uint256"
                          },
                          {
                            "typeIdentifier": "t_uint256",
                            "typeString": "uint256"
                          }
                        ],
                        "expression": {
                          "argumentTypes": null,
                          "id": 955,
                          "name": "Curve",
                          "nodeType": "Identifier",
                          "overloadedDeclarations": [],
                          "referencedDeclaration": 814,
                          "src": "1063:5:2",
                          "typeDescriptions": {
                            "typeIdentifier": "t_type$_t_contract$_Curve_$814_$",
                            "typeString": "type(library Curve)"
                          }
                        },
                        "id": 956,
                        "isConstant": false,
                        "isLValue": false,
                        "isPure": false,
                        "lValueRequested": false,
                        "memberName": "G1Point",
                        "nodeType": "MemberAccess",
                        "referencedDeclaration": 21,
                        "src": "1063:13:2",
                        "typeDescriptions": {
                          "typeIdentifier": "t_type$_t_struct$_G1Point_$21_storage_ptr_$",
                          "typeString": "type(struct Curve.G1Point storage pointer)"
                        }
                      },
                      "id": 963,
                      "isConstant": false,
                      "isLValue": false,
                      "isPure": false,
                      "kind": "structConstructorCall",
                      "lValueRequested": false,
                      "names": [],
                      "nodeType": "FunctionCall",
                      "src": "1063:35:2",
                      "typeDescriptions": {
                        "typeIdentifier": "t_struct$_G1Point_$21_memory",
                        "typeString": "struct Curve.G1Point memory"
                      }
                    },
                    "nodeType": "VariableDeclarationStatement",
                    "src": "1037:61:2"
                  },
                  {
                    "assignments": [
                      968
                    ],
                    "declarations": [
                      {
                        "constant": false,
                        "id": 968,
                        "name": "kG",
                        "nodeType": "VariableDeclaration",
                        "scope": 996,
                        "src": "1106:23:2",
                        "stateVariable": false,
                        "storageLocation": "memory",
                        "typeDescriptions": {
                          "typeIdentifier": "t_struct$_G1Point_$21_memory_ptr",
                          "typeString": "struct Curve.G1Point memory"
                        },
                        "typeName": {
                          "contractScope": null,
                          "id": 967,
                          "name": "Curve.G1Point",
                          "nodeType": "UserDefinedTypeName",
                          "referencedDeclaration": 21,
                          "src": "1106:13:2",
                          "typeDescriptions": {
                            "typeIdentifier": "t_struct$_G1Point_$21_storage_ptr",
                            "typeString": "struct Curve.G1Point storage pointer"
                          }
                        },
                        "value": null,
                        "visibility": "internal"
                      }
                    ],
                    "id": 978,
                    "initialValue": {
                      "argumentTypes": null,
                      "arguments": [
                        {
                          "argumentTypes": null,
                          "id": 971,
                          "name": "sG",
                          "nodeType": "Identifier",
                          "overloadedDeclarations": [],
                          "referencedDeclaration": 938,
                          "src": "1144:2:2",
                          "typeDescriptions": {
                            "typeIdentifier": "t_struct$_G1Point_$21_memory_ptr",
                            "typeString": "struct Curve.G1Point memory"
                          }
                        },
                        {
                          "argumentTypes": null,
                          "arguments": [
                            {
                              "argumentTypes": null,
                              "id": 974,
                              "name": "xG",
                              "nodeType": "Identifier",
                              "overloadedDeclarations": [],
                              "referencedDeclaration": 954,
                              "src": "1160:2:2",
                              "typeDescriptions": {
                                "typeIdentifier": "t_struct$_G1Point_$21_memory_ptr",
                                "typeString": "struct Curve.G1Point memory"
                              }
                            },
                            {
                              "argumentTypes": null,
                              "id": 975,
                              "name": "e",
                              "nodeType": "Identifier",
                              "overloadedDeclarations": [],
                              "referencedDeclaration": 930,
                              "src": "1164:1:2",
                              "typeDescriptions": {
                                "typeIdentifier": "t_uint256",
                                "typeString": "uint256"
                              }
                            }
                          ],
                          "expression": {
                            "argumentTypes": [
                              {
                                "typeIdentifier": "t_struct$_G1Point_$21_memory_ptr",
                                "typeString": "struct Curve.G1Point memory"
                              },
                              {
                                "typeIdentifier": "t_uint256",
                                "typeString": "uint256"
                              }
                            ],
                            "expression": {
                              "argumentTypes": null,
                              "id": 972,
                              "name": "Curve",
                              "nodeType": "Identifier",
                              "overloadedDeclarations": [],
                              "referencedDeclaration": 814,
                              "src": "1148:5:2",
                              "typeDescriptions": {
                                "typeIdentifier": "t_type$_t_contract$_Curve_$814_$",
                                "typeString": "type(library Curve)"
                              }
                            },
                            "id": 973,
                            "isConstant": false,
                            "isLValue": false,
                            "isPure": false,
                            "lValueRequested": false,
                            "memberName": "g1mul",
                            "nodeType": "MemberAccess",
                            "referencedDeclaration": 417,
                            "src": "1148:11:2",
                            "typeDescriptions": {
                              "typeIdentifier": "t_function_internal_view$_t_struct$_G1Point_$21_memory_ptr_$_t_uint256_$returns$_t_struct$_G1Point_$21_memory_ptr_$",
                              "typeString": "function (struct Curve.G1Point memory,uint256) view returns (struct Curve.G1Point memory)"
                            }
                          },
                          "id": 976,
                          "isConstant": false,
                          "isLValue": false,
                          "isPure": false,
                          "kind": "functionCall",
                          "lValueRequested": false,
                          "names": [],
                          "nodeType": "FunctionCall",
                          "src": "1148:18:2",
                          "typeDescriptions": {
                            "typeIdentifier": "t_struct$_G1Point_$21_memory_ptr",
                            "typeString": "struct Curve.G1Point memory"
                          }
                        }
                      ],
                      "expression": {
                        "argumentTypes": [
                          {
                            "typeIdentifier": "t_struct$_G1Point_$21_memory_ptr",
                            "typeString": "struct Curve.G1Point memory"
                          },
                          {
                            "typeIdentifier": "t_struct$_G1Point_$21_memory_ptr",
                            "typeString": "struct Curve.G1Point memory"
                          }
                        ],
                        "expression": {
                          "argumentTypes": null,
                          "id": 969,
                          "name": "Curve",
                          "nodeType": "Identifier",
                          "overloadedDeclarations": [],
                          "referencedDeclaration": 814,
                          "src": "1132:5:2",
                          "typeDescriptions": {
                            "typeIdentifier": "t_type$_t_contract$_Curve_$814_$",
                            "typeString": "type(library Curve)"
                          }
                        },
                        "id": 970,
                        "isConstant": false,
                        "isLValue": false,
                        "isPure": false,
                        "lValueRequested": false,
                        "memberName": "g1add",
                        "nodeType": "MemberAccess",
                        "referencedDeclaration": 373,
                        "src": "1132:11:2",
                        "typeDescriptions": {
                          "typeIdentifier": "t_function_internal_view$_t_struct$_G1Point_$21_memory_ptr_$_t_struct$_G1Point_$21_memory_ptr_$returns$_t_struct$_G1Point_$21_memory_ptr_$",
                          "typeString": "function (struct Curve.G1Point memory,struct Curve.G1Point memory) view returns (struct Curve.G1Point memory)"
                        }
                      },
                      "id": 977,
                      "isConstant": false,
                      "isLValue": false,
                      "isPure": false,
                      "kind": "functionCall",
                      "lValueRequested": false,
                      "names": [],
                      "nodeType": "FunctionCall",
                      "src": "1132:35:2",
                      "typeDescriptions": {
                        "typeIdentifier": "t_struct$_G1Point_$21_memory_ptr",
                        "typeString": "struct Curve.G1Point memory"
                      }
                    },
                    "nodeType": "VariableDeclarationStatement",
                    "src": "1106:61:2"
                  },
                  {
                    "expression": {
                      "argumentTypes": null,
                      "arguments": [
                        {
                          "argumentTypes": null,
                          "arguments": [
                            {
                              "argumentTypes": null,
                              "baseExpression": {
                                "argumentTypes": null,
                                "id": 981,
                                "name": "pubkey",
                                "nodeType": "Identifier",
                                "overloadedDeclarations": [],
                                "referencedDeclaration": 924,
                                "src": "1200:6:2",
                                "typeDescriptions": {
                                  "typeIdentifier": "t_array$_t_uint256_$2_memory_ptr",
                                  "typeString": "uint256[2] memory"
                                }
                              },
                              "id": 983,
                              "indexExpression": {
                                "argumentTypes": null,
                                "hexValue": "30",
                                "id": 982,
                                "isConstant": false,
                                "isLValue": false,
                                "isPure": true,
                                "kind": "number",
                                "lValueRequested": false,
                                "nodeType": "Literal",
                                "src": "1207:1:2",
                                "subdenomination": null,
                                "typeDescriptions": {
                                  "typeIdentifier": "t_rational_0_by_1",
                                  "typeString": "int_const 0"
                                },
                                "value": "0"
                              },
                              "isConstant": false,
                              "isLValue": true,
                              "isPure": false,
                              "lValueRequested": false,
                              "nodeType": "IndexAccess",
                              "src": "1200:9:2",
                              "typeDescriptions": {
                                "typeIdentifier": "t_uint256",
                                "typeString": "uint256"
                              }
                            },
                            {
                              "argumentTypes": null,
                              "baseExpression": {
                                "argumentTypes": null,
                                "id": 984,
                                "name": "pubkey",
                                "nodeType": "Identifier",
                                "overloadedDeclarations": [],
                                "referencedDeclaration": 924,
                                "src": "1211:6:2",
                                "typeDescriptions": {
                                  "typeIdentifier": "t_array$_t_uint256_$2_memory_ptr",
                                  "typeString": "uint256[2] memory"
                                }
                              },
                              "id": 986,
                              "indexExpression": {
                                "argumentTypes": null,
                                "hexValue": "31",
                                "id": 985,
                                "isConstant": false,
                                "isLValue": false,
                                "isPure": true,
                                "kind": "number",
                                "lValueRequested": false,
                                "nodeType": "Literal",
                                "src": "1218:1:2",
                                "subdenomination": null,
                                "typeDescriptions": {
                                  "typeIdentifier": "t_rational_1_by_1",
                                  "typeString": "int_const 1"
                                },
                                "value": "1"
                              },
                              "isConstant": false,
                              "isLValue": true,
                              "isPure": false,
                              "lValueRequested": false,
                              "nodeType": "IndexAccess",
                              "src": "1211:9:2",
                              "typeDescriptions": {
                                "typeIdentifier": "t_uint256",
                                "typeString": "uint256"
                              }
                            },
                            {
                              "argumentTypes": null,
                              "expression": {
                                "argumentTypes": null,
                                "id": 987,
                                "name": "kG",
                                "nodeType": "Identifier",
                                "overloadedDeclarations": [],
                                "referencedDeclaration": 968,
                                "src": "1222:2:2",
                                "typeDescriptions": {
                                  "typeIdentifier": "t_struct$_G1Point_$21_memory_ptr",
                                  "typeString": "struct Curve.G1Point memory"
                                }
                              },
                              "id": 988,
                              "isConstant": false,
                              "isLValue": true,
                              "isPure": false,
                              "lValueRequested": false,
                              "memberName": "X",
                              "nodeType": "MemberAccess",
                              "referencedDeclaration": 18,
                              "src": "1222:4:2",
                              "typeDescriptions": {
                                "typeIdentifier": "t_uint256",
                                "typeString": "uint256"
                              }
                            },
                            {
                              "argumentTypes": null,
                              "expression": {
                                "argumentTypes": null,
                                "id": 989,
                                "name": "kG",
                                "nodeType": "Identifier",
                                "overloadedDeclarations": [],
                                "referencedDeclaration": 968,
                                "src": "1228:2:2",
                                "typeDescriptions": {
                                  "typeIdentifier": "t_struct$_G1Point_$21_memory_ptr",
                                  "typeString": "struct Curve.G1Point memory"
                                }
                              },
                              "id": 990,
                              "isConstant": false,
                              "isLValue": true,
                              "isPure": false,
                              "lValueRequested": false,
                              "memberName": "Y",
                              "nodeType": "MemberAccess",
                              "referencedDeclaration": 20,
                              "src": "1228:4:2",
                              "typeDescriptions": {
                                "typeIdentifier": "t_uint256",
                                "typeString": "uint256"
                              }
                            },
                            {
                              "argumentTypes": null,
                              "id": 991,
                              "name": "message",
                              "nodeType": "Identifier",
                              "overloadedDeclarations": [],
                              "referencedDeclaration": 926,
                              "src": "1234:7:2",
                              "typeDescriptions": {
                                "typeIdentifier": "t_uint256",
                                "typeString": "uint256"
                              }
                            }
                          ],
                          "expression": {
                            "argumentTypes": [
                              {
                                "typeIdentifier": "t_uint256",
                                "typeString": "uint256"
                              },
                              {
                                "typeIdentifier": "t_uint256",
                                "typeString": "uint256"
                              },
                              {
                                "typeIdentifier": "t_uint256",
                                "typeString": "uint256"
                              },
                              {
                                "typeIdentifier": "t_uint256",
                                "typeString": "uint256"
                              },
                              {
                                "typeIdentifier": "t_uint256",
                                "typeString": "uint256"
                              }
                            ],
                            "id": 980,
                            "name": "keccak256",
                            "nodeType": "Identifier",
                            "overloadedDeclarations": [],
                            "referencedDeclaration": 1028,
                            "src": "1190:9:2",
                            "typeDescriptions": {
                              "typeIdentifier": "t_function_sha3_pure$__$returns$_t_bytes32_$",
                              "typeString": "function () pure returns (bytes32)"
                            }
                          },
                          "id": 992,
                          "isConstant": false,
                          "isLValue": false,
                          "isPure": false,
                          "kind": "functionCall",
                          "lValueRequested": false,
                          "names": [],
                          "nodeType": "FunctionCall",
                          "src": "1190:52:2",
                          "typeDescriptions": {
                            "typeIdentifier": "t_bytes32",
                            "typeString": "bytes32"
                          }
                        }
                      ],
                      "expression": {
                        "argumentTypes": [
                          {
                            "typeIdentifier": "t_bytes32",
                            "typeString": "bytes32"
                          }
                        ],
                        "id": 979,
                        "isConstant": false,
                        "isLValue": false,
                        "isPure": true,
                        "lValueRequested": false,
                        "nodeType": "ElementaryTypeNameExpression",
                        "src": "1182:7:2",
                        "typeDescriptions": {
                          "typeIdentifier": "t_type$_t_uint256_$",
                          "typeString": "type(uint256)"
                        },
                        "typeName": "uint256"
                      },
                      "id": 993,
                      "isConstant": false,
                      "isLValue": false,
                      "isPure": false,
                      "kind": "typeConversion",
                      "lValueRequested": false,
                      "names": [],
                      "nodeType": "FunctionCall",
                      "src": "1182:61:2",
                      "typeDescriptions": {
                        "typeIdentifier": "t_uint256",
                        "typeString": "uint256"
                      }
                    },
                    "functionReturnParameters": 934,
                    "id": 994,
                    "nodeType": "Return",
                    "src": "1175:68:2"
                  }
                ]
              },
              "id": 996,
              "implemented": true,
              "isConstructor": false,
              "isDeclaredConst": true,
              "modifiers": [],
              "name": "CalcProof",
              "nodeType": "FunctionDefinition",
              "parameters": {
                "id": 931,
                "nodeType": "ParameterList",
                "parameters": [
                  {
                    "constant": false,
                    "id": 924,
                    "name": "pubkey",
                    "nodeType": "VariableDeclaration",
                    "scope": 996,
                    "src": "848:17:2",
                    "stateVariable": false,
                    "storageLocation": "default",
                    "typeDescriptions": {
                      "typeIdentifier": "t_array$_t_uint256_$2_memory_ptr",
                      "typeString": "uint256[2] memory"
                    },
                    "typeName": {
                      "baseType": {
                        "id": 921,
                        "name": "uint256",
                        "nodeType": "ElementaryTypeName",
                        "src": "848:7:2",
                        "typeDescriptions": {
                          "typeIdentifier": "t_uint256",
                          "typeString": "uint256"
                        }
                      },
                      "id": 923,
                      "length": {
                        "argumentTypes": null,
                        "hexValue": "32",
                        "id": 922,
                        "isConstant": false,
                        "isLValue": false,
                        "isPure": false,
                        "kind": "number",
                        "lValueRequested": false,
                        "nodeType": "Literal",
                        "src": "856:1:2",
                        "subdenomination": null,
                        "typeDescriptions": {
                          "typeIdentifier": "t_rational_2_by_1",
                          "typeString": "int_const 2"
                        },
                        "value": "2"
                      },
                      "nodeType": "ArrayTypeName",
                      "src": "848:10:2",
                      "typeDescriptions": {
                        "typeIdentifier": "t_array$_t_uint256_$2_storage_ptr",
                        "typeString": "uint256[2] storage pointer"
                      }
                    },
                    "value": null,
                    "visibility": "internal"
                  },
                  {
                    "constant": false,
                    "id": 926,
                    "name": "message",
                    "nodeType": "VariableDeclaration",
                    "scope": 996,
                    "src": "867:15:2",
                    "stateVariable": false,
                    "storageLocation": "default",
                    "typeDescriptions": {
                      "typeIdentifier": "t_uint256",
                      "typeString": "uint256"
                    },
                    "typeName": {
                      "id": 925,
                      "name": "uint256",
                      "nodeType": "ElementaryTypeName",
                      "src": "867:7:2",
                      "typeDescriptions": {
                        "typeIdentifier": "t_uint256",
                        "typeString": "uint256"
                      }
                    },
                    "value": null,
                    "visibility": "internal"
                  },
                  {
                    "constant": false,
                    "id": 928,
                    "name": "s",
                    "nodeType": "VariableDeclaration",
                    "scope": 996,
                    "src": "884:9:2",
                    "stateVariable": false,
                    "storageLocation": "default",
                    "typeDescriptions": {
                      "typeIdentifier": "t_uint256",
                      "typeString": "uint256"
                    },
                    "typeName": {
                      "id": 927,
                      "name": "uint256",
                      "nodeType": "ElementaryTypeName",
                      "src": "884:7:2",
                      "typeDescriptions": {
                        "typeIdentifier": "t_uint256",
                        "typeString": "uint256"
                      }
                    },
                    "value": null,
                    "visibility": "internal"
                  },
                  {
                    "constant": false,
                    "id": 930,
                    "name": "e",
                    "nodeType": "VariableDeclaration",
                    "scope": 996,
                    "src": "895:9:2",
                    "stateVariable": false,
                    "storageLocation": "default",
                    "typeDescriptions": {
                      "typeIdentifier": "t_uint256",
                      "typeString": "uint256"
                    },
                    "typeName": {
                      "id": 929,
                      "name": "uint256",
                      "nodeType": "ElementaryTypeName",
                      "src": "895:7:2",
                      "typeDescriptions": {
                        "typeIdentifier": "t_uint256",
                        "typeString": "uint256"
                      }
                    },
                    "value": null,
                    "visibility": "internal"
                  }
                ],
                "src": "846:60:2"
              },
              "payable": false,
              "returnParameters": {
                "id": 934,
                "nodeType": "ParameterList",
                "parameters": [
                  {
                    "constant": false,
                    "id": 933,
                    "name": "",
                    "nodeType": "VariableDeclaration",
                    "scope": 996,
                    "src": "946:7:2",
                    "stateVariable": false,
                    "storageLocation": "default",
                    "typeDescriptions": {
                      "typeIdentifier": "t_uint256",
                      "typeString": "uint256"
                    },
                    "typeName": {
                      "id": 932,
                      "name": "uint256",
                      "nodeType": "ElementaryTypeName",
                      "src": "946:7:2",
                      "typeDescriptions": {
                        "typeIdentifier": "t_uint256",
                        "typeString": "uint256"
                      }
                    },
                    "value": null,
                    "visibility": "internal"
                  }
                ],
                "src": "945:9:2"
              },
              "scope": 1022,
              "src": "828:420:2",
              "stateMutability": "view",
              "superFunction": null,
              "visibility": "internal"
            },
            {
              "body": {
                "id": 1020,
                "nodeType": "Block",
                "src": "1382:57:2",
                "statements": [
                  {
                    "expression": {
                      "argumentTypes": null,
                      "commonType": {
                        "typeIdentifier": "t_uint256",
                        "typeString": "uint256"
                      },
                      "id": 1018,
                      "isConstant": false,
                      "isLValue": false,
                      "isPure": false,
                      "lValueRequested": false,
                      "leftExpression": {
                        "argumentTypes": null,
                        "id": 1011,
                        "name": "e",
                        "nodeType": "Identifier",
                        "overloadedDeclarations": [],
                        "referencedDeclaration": 1006,
                        "src": "1397:1:2",
                        "typeDescriptions": {
                          "typeIdentifier": "t_uint256",
                          "typeString": "uint256"
                        }
                      },
                      "nodeType": "BinaryOperation",
                      "operator": "==",
                      "rightExpression": {
                        "argumentTypes": null,
                        "arguments": [
                          {
                            "argumentTypes": null,
                            "id": 1013,
                            "name": "pubkey",
                            "nodeType": "Identifier",
                            "overloadedDeclarations": [],
                            "referencedDeclaration": 1000,
                            "src": "1412:6:2",
                            "typeDescriptions": {
                              "typeIdentifier": "t_array$_t_uint256_$2_memory_ptr",
                              "typeString": "uint256[2] memory"
                            }
                          },
                          {
                            "argumentTypes": null,
                            "id": 1014,
                            "name": "message",
                            "nodeType": "Identifier",
                            "overloadedDeclarations": [],
                            "referencedDeclaration": 1002,
                            "src": "1420:7:2",
                            "typeDescriptions": {
                              "typeIdentifier": "t_uint256",
                              "typeString": "uint256"
                            }
                          },
                          {
                            "argumentTypes": null,
                            "id": 1015,
                            "name": "s",
                            "nodeType": "Identifier",
                            "overloadedDeclarations": [],
                            "referencedDeclaration": 1004,
                            "src": "1429:1:2",
                            "typeDescriptions": {
                              "typeIdentifier": "t_uint256",
                              "typeString": "uint256"
                            }
                          },
                          {
                            "argumentTypes": null,
                            "id": 1016,
                            "name": "e",
                            "nodeType": "Identifier",
                            "overloadedDeclarations": [],
                            "referencedDeclaration": 1006,
                            "src": "1432:1:2",
                            "typeDescriptions": {
                              "typeIdentifier": "t_uint256",
                              "typeString": "uint256"
                            }
                          }
                        ],
                        "expression": {
                          "argumentTypes": [
                            {
                              "typeIdentifier": "t_array$_t_uint256_$2_memory_ptr",
                              "typeString": "uint256[2] memory"
                            },
                            {
                              "typeIdentifier": "t_uint256",
                              "typeString": "uint256"
                            },
                            {
                              "typeIdentifier": "t_uint256",
                              "typeString": "uint256"
                            },
                            {
                              "typeIdentifier": "t_uint256",
                              "typeString": "uint256"
                            }
                          ],
                          "id": 1012,
                          "name": "CalcProof",
                          "nodeType": "Identifier",
                          "overloadedDeclarations": [],
                          "referencedDeclaration": 996,
                          "src": "1402:9:2",
                          "typeDescriptions": {
                            "typeIdentifier": "t_function_internal_view$_t_array$_t_uint256_$2_memory_ptr_$_t_uint256_$_t_uint256_$_t_uint256_$returns$_t_uint256_$",
                            "typeString": "function (uint256[2] memory,uint256,uint256,uint256) view returns (uint256)"
                          }
                        },
                        "id": 1017,
                        "isConstant": false,
                        "isLValue": false,
                        "isPure": false,
                        "kind": "functionCall",
                        "lValueRequested": false,
                        "names": [],
                        "nodeType": "FunctionCall",
                        "src": "1402:32:2",
                        "typeDescriptions": {
                          "typeIdentifier": "t_uint256",
                          "typeString": "uint256"
                        }
                      },
                      "src": "1397:37:2",
                      "typeDescriptions": {
                        "typeIdentifier": "t_bool",
                        "typeString": "bool"
                      }
                    },
                    "functionReturnParameters": 1010,
                    "id": 1019,
                    "nodeType": "Return",
                    "src": "1390:44:2"
                  }
                ]
              },
              "id": 1021,
              "implemented": true,
              "isConstructor": false,
              "isDeclaredConst": true,
              "modifiers": [],
              "name": "VerifyProof",
              "nodeType": "FunctionDefinition",
              "parameters": {
                "id": 1007,
                "nodeType": "ParameterList",
                "parameters": [
                  {
                    "constant": false,
                    "id": 1000,
                    "name": "pubkey",
                    "nodeType": "VariableDeclaration",
                    "scope": 1021,
                    "src": "1276:17:2",
                    "stateVariable": false,
                    "storageLocation": "default",
                    "typeDescriptions": {
                      "typeIdentifier": "t_array$_t_uint256_$2_memory_ptr",
                      "typeString": "uint256[2] memory"
                    },
                    "typeName": {
                      "baseType": {
                        "id": 997,
                        "name": "uint256",
                        "nodeType": "ElementaryTypeName",
                        "src": "1276:7:2",
                        "typeDescriptions": {
                          "typeIdentifier": "t_uint256",
                          "typeString": "uint256"
                        }
                      },
                      "id": 999,
                      "length": {
                        "argumentTypes": null,
                        "hexValue": "32",
                        "id": 998,
                        "isConstant": false,
                        "isLValue": false,
                        "isPure": false,
                        "kind": "number",
                        "lValueRequested": false,
                        "nodeType": "Literal",
                        "src": "1284:1:2",
                        "subdenomination": null,
                        "typeDescriptions": {
                          "typeIdentifier": "t_rational_2_by_1",
                          "typeString": "int_const 2"
                        },
                        "value": "2"
                      },
                      "nodeType": "ArrayTypeName",
                      "src": "1276:10:2",
                      "typeDescriptions": {
                        "typeIdentifier": "t_array$_t_uint256_$2_storage_ptr",
                        "typeString": "uint256[2] storage pointer"
                      }
                    },
                    "value": null,
                    "visibility": "internal"
                  },
                  {
                    "constant": false,
                    "id": 1002,
                    "name": "message",
                    "nodeType": "VariableDeclaration",
                    "scope": 1021,
                    "src": "1295:15:2",
                    "stateVariable": false,
                    "storageLocation": "default",
                    "typeDescriptions": {
                      "typeIdentifier": "t_uint256",
                      "typeString": "uint256"
                    },
                    "typeName": {
                      "id": 1001,
                      "name": "uint256",
                      "nodeType": "ElementaryTypeName",
                      "src": "1295:7:2",
                      "typeDescriptions": {
                        "typeIdentifier": "t_uint256",
                        "typeString": "uint256"
                      }
                    },
                    "value": null,
                    "visibility": "internal"
                  },
                  {
                    "constant": false,
                    "id": 1004,
                    "name": "s",
                    "nodeType": "VariableDeclaration",
                    "scope": 1021,
                    "src": "1312:9:2",
                    "stateVariable": false,
                    "storageLocation": "default",
                    "typeDescriptions": {
                      "typeIdentifier": "t_uint256",
                      "typeString": "uint256"
                    },
                    "typeName": {
                      "id": 1003,
                      "name": "uint256",
                      "nodeType": "ElementaryTypeName",
                      "src": "1312:7:2",
                      "typeDescriptions": {
                        "typeIdentifier": "t_uint256",
                        "typeString": "uint256"
                      }
                    },
                    "value": null,
                    "visibility": "internal"
                  },
                  {
                    "constant": false,
                    "id": 1006,
                    "name": "e",
                    "nodeType": "VariableDeclaration",
                    "scope": 1021,
                    "src": "1323:9:2",
                    "stateVariable": false,
                    "storageLocation": "default",
                    "typeDescriptions": {
                      "typeIdentifier": "t_uint256",
                      "typeString": "uint256"
                    },
                    "typeName": {
                      "id": 1005,
                      "name": "uint256",
                      "nodeType": "ElementaryTypeName",
                      "src": "1323:7:2",
                      "typeDescriptions": {
                        "typeIdentifier": "t_uint256",
                        "typeString": "uint256"
                      }
                    },
                    "value": null,
                    "visibility": "internal"
                  }
                ],
                "src": "1274:60:2"
              },
              "payable": false,
              "returnParameters": {
                "id": 1010,
                "nodeType": "ParameterList",
                "parameters": [
                  {
                    "constant": false,
                    "id": 1009,
                    "name": "",
                    "nodeType": "VariableDeclaration",
                    "scope": 1021,
                    "src": "1374:4:2",
                    "stateVariable": false,
                    "storageLocation": "default",
                    "typeDescriptions": {
                      "typeIdentifier": "t_bool",
                      "typeString": "bool"
                    },
                    "typeName": {
                      "id": 1008,
                      "name": "bool",
                      "nodeType": "ElementaryTypeName",
                      "src": "1374:4:2",
                      "typeDescriptions": {
                        "typeIdentifier": "t_bool",
                        "typeString": "bool"
                      }
                    },
                    "value": null,
                    "visibility": "internal"
                  }
                ],
                "src": "1373:6:2"
              },
              "scope": 1022,
              "src": "1254:185:2",
              "stateMutability": "view",
              "superFunction": null,
              "visibility": "internal"
            }
          ],
          "scope": 1023,
          "src": "123:1319:2"
        }
      ],
      "src": "0:1442:2"
    },
    "compiler": {
      "name": "solc",
      "version": "0.4.19+commit.c4cbbb05.Emscripten.clang"
    },
    "networks": {
      "4447": {
        "events": {},
        "links": {},
        "address": "0x345ca3e014aaf5dca488057592ee47305d9b3e10",
        "transactionHash": "0x87869fe7c1f8c66278f157b6c7d5fcd992c6d0da21cd35e1db29bf11cad5e847"
      }
    },
    "schemaVersion": "2.0.0",
    "updatedAt": "2018-03-18T16:03:00.071Z"
  }];
  var myContract=web3.eth.contract(SchnorrABI);
  var schnorr=myContract.at(receivers[3].contractAddress);
  console.log('\ncontract 3(Schnorr) is:',schnorr.abi[0]['contractName'])
  
  //var result =schnorr.VerifyProof(0x12345, 0x77777,{from:Alice});
  //schnorr.CalcProof()  
  var ZKProofABI=[
    {
      "constant": true,
      "inputs": [
        {
          "name": "secret",
          "type": "uint256"
        },
        {
          "name": "message",
          "type": "uint256"
        }
      ],
      "name": "CreateProof",
      "outputs": [
        {
          "name": "out_pubkey",
          "type": "uint256[2]"
        },
        {
          "name": "out_s",
          "type": "uint256"
        },
        {
          "name": "out_e",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    }
  ];

myContract=eth.contract(ZKProofABI);
var ZKProof=myContract.at('0xeec918d74c746167564401103096d45bbd494b74');
//console.log('\ncontract (ZKProof) is:',ZKProof.abi[0]['contractName']); 
/*ZKProof.CreateProof(0x12345, 0x77777,{from:Alice}).then( fuction(result){
  console.log(result);
});*/
var p=ZKProof.CreateProof(12345, 77777)/*.then(function(value) {*/
  console.log(p[0][0].toNumber());
  console.log(p[0][0].toString(16));
  
//});
    //console.log(p);
  //schnorr.CalcProof()  


  
}