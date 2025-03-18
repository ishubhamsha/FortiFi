// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "./PriceOracle.sol";

contract MicroLendingPlatform is AccessControl, ReentrancyGuard {
    PriceOracle public priceOracle;
    bytes32 public constant DAO_MEMBER_ROLE = keccak256("DAO_MEMBER_ROLE");
    
    IERC20 public lendingToken;
    
    struct Loan {
        address borrower;
        uint256 amount;
        uint256 dueDate;
        uint256 interestRate;
        bool approved;
        bool repaid;
        bool defaulted;
        uint256 creditScore;
    }
    
    struct InsurancePool {
        uint256 balance;
        uint256 feePercentage;
        uint256 maxCoveragePercentage;
    }
    
    mapping(uint256 => Loan) public loans;
    mapping(uint256 => mapping(address => bool)) public daoVotes;
    uint256 public loanCount;
    
    InsurancePool public insurancePool;
    
    event LoanRequested(uint256 loanId, address borrower, uint256 amount);
    event LoanApproved(uint256 loanId);
    event LoanRepaid(uint256 loanId);
    event LoanDefaulted(uint256 loanId);
    event InsurancePaid(uint256 loanId, uint256 amount);
    
    constructor(address _lendingToken, address _priceOracle) {
        priceOracle = PriceOracle(_priceOracle);
        lendingToken = IERC20(_lendingToken);
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(DAO_MEMBER_ROLE, msg.sender);
        
        // Initialize insurance pool with 2% fee and 50% max coverage
        insurancePool = InsurancePool({
            balance: 0,
            feePercentage: 2,
            maxCoveragePercentage: 50
        });
    }
    
    function requestLoan(uint256 amountInETH, uint256 creditScore) external returns (uint256) {
        // Convert ETH amount to USDT
        uint256 ethUsdtPrice = priceOracle.getLatestETHUSDTPrice();
        uint256 amountInUSDT = (amountInETH * ethUsdtPrice) / 1e8; // Price feed has 8 decimals
        require(amountInUSDT > 0, "Amount must be greater than 0");
        
        uint256 loanId = loanCount++;
        loans[loanId] = Loan({
            borrower: msg.sender,
            amount: amountInUSDT,
            dueDate: block.timestamp + 30 days,
            interestRate: calculateInterestRate(creditScore),
            approved: false,
            repaid: false,
            defaulted: false,
            creditScore: creditScore
        });
        
        emit LoanRequested(loanId, msg.sender, amountInUSDT);
        return loanId;
    }
    
    function voteLoan(uint256 loanId, bool approve) external onlyRole(DAO_MEMBER_ROLE) {
        require(!loans[loanId].approved, "Loan already approved");
        daoVotes[loanId][msg.sender] = approve;
    }
    
    function approveLoan(uint256 loanId) external onlyRole(DAO_MEMBER_ROLE) nonReentrant {
        Loan storage loan = loans[loanId];
        require(!loan.approved, "Loan already approved");
        
        loan.approved = true;
        
        // Calculate insurance fee
        uint256 insuranceFee = (loan.amount * insurancePool.feePercentage) / 100;
        uint256 loanAmountAfterFee = loan.amount - insuranceFee;
        
        // Transfer loan amount to borrower
        require(lendingToken.transfer(loan.borrower, loanAmountAfterFee), "Transfer failed");
        
        // Add insurance fee to pool
        insurancePool.balance += insuranceFee;
        
        emit LoanApproved(loanId);
    }
    
    function repayLoan(uint256 loanId) external nonReentrant {
        Loan storage loan = loans[loanId];
        require(loan.approved && !loan.repaid && !loan.defaulted, "Invalid loan state");
        
        uint256 interest = (loan.amount * loan.interestRate) / 100;
        uint256 totalRepayment = loan.amount + interest;
        
        require(lendingToken.transferFrom(msg.sender, address(this), totalRepayment), "Transfer failed");
        
        loan.repaid = true;
        emit LoanRepaid(loanId);
    }
    
    function markLoanAsDefaulted(uint256 loanId) external onlyRole(DAO_MEMBER_ROLE) {
        Loan storage loan = loans[loanId];
        require(loan.approved && !loan.repaid && !loan.defaulted, "Invalid loan state");
        require(block.timestamp > loan.dueDate, "Loan not yet due");
        
        loan.defaulted = true;
        
        // Calculate insurance payout
        uint256 coverageAmount = (loan.amount * insurancePool.maxCoveragePercentage) / 100;
        uint256 actualPayout = coverageAmount > insurancePool.balance ? insurancePool.balance : coverageAmount;
        
        if (actualPayout > 0) {
            insurancePool.balance -= actualPayout;
            require(lendingToken.transfer(loan.borrower, actualPayout), "Insurance payout failed");
            emit InsurancePaid(loanId, actualPayout);
        }
        
        emit LoanDefaulted(loanId);
    }
    
    function calculateInterestRate(uint256 creditScore) internal pure returns (uint256) {
        if (creditScore >= 80) return 5;  // 5% interest
        if (creditScore >= 60) return 10; // 10% interest
        return 15;                        // 15% interest
    }
    
    function updateInsuranceParams(uint256 _feePercentage, uint256 _maxCoveragePercentage) 
        external 
        onlyRole(DEFAULT_ADMIN_ROLE) 
    {
        require(_feePercentage <= 5, "Fee too high");
        require(_maxCoveragePercentage <= 80, "Coverage too high");
        insurancePool.feePercentage = _feePercentage;
        insurancePool.maxCoveragePercentage = _maxCoveragePercentage;
    }
    
    function getInsurancePoolInfo() external view returns (InsurancePool memory) {
        return insurancePool;
    }
}
