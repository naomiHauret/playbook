/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { ethers } from 'ethers'
import {
  DeployContractOptions,
  FactoryOptions,
  HardhatEthersHelpers as HardhatEthersHelpersBase,
} from '@nomicfoundation/hardhat-ethers/types'

import * as Contracts from '.'

declare module 'hardhat/types/runtime' {
  interface HardhatEthersHelpers extends HardhatEthersHelpersBase {
    getContractFactory(
      name: 'IChatGpt',
      signerOrOptions?: ethers.Signer | FactoryOptions,
    ): Promise<Contracts.IChatGpt__factory>
    getContractFactory(
      name: 'IOracle',
      signerOrOptions?: ethers.Signer | FactoryOptions,
    ): Promise<Contracts.IOracle__factory>
    getContractFactory(
      name: 'PlaybookNarrator',
      signerOrOptions?: ethers.Signer | FactoryOptions,
    ): Promise<Contracts.PlaybookNarrator__factory>
    getContractFactory(
      name: 'PlaybookNarrator',
      signerOrOptions?: ethers.Signer | FactoryOptions,
    ): Promise<Contracts.PlaybookNarrator__factory>
    getContractFactory(
      name: 'PlaybookNarrator',
      signerOrOptions?: ethers.Signer | FactoryOptions,
    ): Promise<Contracts.PlaybookNarrator__factory>
    getContractFactory(
      name: 'PlaybookNarrator',
      signerOrOptions?: ethers.Signer | FactoryOptions,
    ): Promise<Contracts.PlaybookNarrator__factory>

    getContractAt(
      name: 'IChatGpt',
      address: string | ethers.Addressable,
      signer?: ethers.Signer,
    ): Promise<Contracts.IChatGpt>
    getContractAt(
      name: 'IOracle',
      address: string | ethers.Addressable,
      signer?: ethers.Signer,
    ): Promise<Contracts.IOracle>
    getContractAt(
      name: 'PlaybookNarrator',
      address: string | ethers.Addressable,
      signer?: ethers.Signer,
    ): Promise<Contracts.PlaybookNarrator>
    getContractAt(
      name: 'PlaybookNarrator',
      address: string | ethers.Addressable,
      signer?: ethers.Signer,
    ): Promise<Contracts.PlaybookNarrator>
    getContractAt(
      name: 'PlaybookNarrator',
      address: string | ethers.Addressable,
      signer?: ethers.Signer,
    ): Promise<Contracts.PlaybookNarrator>
    getContractAt(
      name: 'PlaybookNarrator',
      address: string | ethers.Addressable,
      signer?: ethers.Signer,
    ): Promise<Contracts.PlaybookNarrator>

    deployContract(
      name: 'IChatGpt',
      signerOrOptions?: ethers.Signer | DeployContractOptions,
    ): Promise<Contracts.IChatGpt>
    deployContract(
      name: 'IOracle',
      signerOrOptions?: ethers.Signer | DeployContractOptions,
    ): Promise<Contracts.IOracle>
    deployContract(
      name: 'PlaybookNarrator',
      signerOrOptions?: ethers.Signer | DeployContractOptions,
    ): Promise<Contracts.PlaybookNarrator>
    deployContract(
      name: 'PlaybookNarrator',
      signerOrOptions?: ethers.Signer | DeployContractOptions,
    ): Promise<Contracts.PlaybookNarrator>
    deployContract(
      name: 'PlaybookNarrator',
      signerOrOptions?: ethers.Signer | DeployContractOptions,
    ): Promise<Contracts.PlaybookNarrator>
    deployContract(
      name: 'PlaybookNarrator',
      signerOrOptions?: ethers.Signer | DeployContractOptions,
    ): Promise<Contracts.PlaybookNarrator>

    deployContract(
      name: 'IChatGpt',
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions,
    ): Promise<Contracts.IChatGpt>
    deployContract(
      name: 'IOracle',
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions,
    ): Promise<Contracts.IOracle>
    deployContract(
      name: 'PlaybookNarrator',
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions,
    ): Promise<Contracts.PlaybookNarrator>
    deployContract(
      name: 'PlaybookNarrator',
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions,
    ): Promise<Contracts.PlaybookNarrator>
    deployContract(
      name: 'PlaybookNarrator',
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions,
    ): Promise<Contracts.PlaybookNarrator>
    deployContract(
      name: 'PlaybookNarrator',
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions,
    ): Promise<Contracts.PlaybookNarrator>

    // default types
    getContractFactory(
      name: string,
      signerOrOptions?: ethers.Signer | FactoryOptions,
    ): Promise<ethers.ContractFactory>
    getContractFactory(
      abi: any[],
      bytecode: ethers.BytesLike,
      signer?: ethers.Signer,
    ): Promise<ethers.ContractFactory>
    getContractAt(
      nameOrAbi: string | any[],
      address: string | ethers.Addressable,
      signer?: ethers.Signer,
    ): Promise<ethers.Contract>
    deployContract(
      name: string,
      signerOrOptions?: ethers.Signer | DeployContractOptions,
    ): Promise<ethers.Contract>
    deployContract(
      name: string,
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions,
    ): Promise<ethers.Contract>
  }
}
