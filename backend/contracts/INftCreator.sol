 ///@dev Mock for testing use PLEASE COMMENT OUT ON LIVE

 interface INftCreator {
    function mockNonblockingLzReceive(
        uint16 _srcChainId,
        bytes memory _srcAddress,
        uint64, /*_nonce*/
        bytes memory _payload
    ) external;
 } 