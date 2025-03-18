// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface AggregatorV3Interface {
  function decimals() external view returns (uint8);
  function description() external view returns (string memory);
  function version() external view returns (uint256);
  function getRoundData(uint80 _roundId) external view returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound);
  function latestRoundData() external view returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound);
}

contract PriceOracle {
    AggregatorV3Interface internal ethUsdPriceFeed;
    AggregatorV3Interface internal usdtUsdPriceFeed;

    constructor() {
        // Base Sepolia ETH/USD Price Feed
        ethUsdPriceFeed = AggregatorV3Interface(0xcD2A119bD1F7DF95d706DE6F2057fDD45A0503E2);
        // Base Sepolia USDT/USD Price Feed
        usdtUsdPriceFeed = AggregatorV3Interface(0xcD2A119bD1F7DF95d706DE6F2057fDD45A0503E2);
    }

    function getLatestETHUSDTPrice() public view returns (uint256) {
        (, int ethPrice,,,) = ethUsdPriceFeed.latestRoundData();
        (, int usdtPrice,,,) = usdtUsdPriceFeed.latestRoundData();
        
        // Convert price to 8 decimals
        return (uint256(ethPrice) * 1e8) / uint256(usdtPrice);
    }
}
