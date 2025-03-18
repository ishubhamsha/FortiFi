import React, { useState, useEffect } from 'react';
import {
  ChakraProvider,
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  useToast,
  Container,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useColorModeValue,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Image,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { ethers } from 'ethers';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MicroLendingPlatform from './contracts/MicroLendingPlatform.json';
import GroupLending from './components/GroupLending';
import UserDashboard from './components/UserDashboard';
import AdminDashboard from './components/AdminDashboard';
import LandingPage from './components/LandingPage';
import DAOApproval from './components/DAOApproval';
import Repayment from './components/Repayment'  ;

const LENDING_PLATFORM_ADDRESS = "0x03A54407c196c56FA54732FfBFF1FDfaE6b79ADb";

function App() {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [ethUsdtPrice, setEthUsdtPrice] = useState(null);
  const [userRole, setUserRole] = useState(null); // 'user' or 'admin'
  const [currentView, setCurrentView] = useState('landing'); // 'landing', 'assessment', 'dashboard'
  const [isConnecting, setIsConnecting] = useState(false); // Adding connection state
  const toast = useToast();
  const bgColor = useColorModeValue('black', 'black');
  const borderColor = useColorModeValue('yellow.200', 'yellow.800');
  const headingColor = useColorModeValue('yellow.600', 'yellow.300');
  const tabListBg = useColorModeValue('yellow.50', 'yellow.700');
  const textColor = useColorModeValue('yellow.500', 'yellow.300');

  const fetchEthPrice = async () => {
    if (contract) {
      try {
        const priceOracleAddress = await contract.priceOracle();
        const priceOracleAbi = [
          "function getLatestETHUSDTPrice() view returns (uint256)"
        ];
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const priceOracle = new ethers.Contract(priceOracleAddress, priceOracleAbi, provider);
        
        const price = await priceOracle.getLatestETHUSDTPrice();
        console.log('Fetched ETH price:', ethers.utils.formatUnits(price, 8));
        setEthUsdtPrice(price);
      } catch (error) {
        console.error('Error fetching ETH price:', error);
      }
    }
  };

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          await connectWallet();
        }
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (contract) {
      fetchEthPrice();
      const interval = setInterval(fetchEthPrice, 60000);
      return () => clearInterval(interval);
    }
  }, [contract]);

  const connectWallet = async () => {
    console.log('Connecting wallet...');
    setIsConnecting(true);
    if (!window.ethereum) {
      toast({
        title: "Wallet not detected",
        description: "Please install the MetaMask wallet and try again. Click OK to go to the installation.",
        status: "warning",
        duration: 10000,
        isClosable: true,
        onCloseComplete: () => {
          window.open('https://metamask.io/download.html', '_blank');
        }
      });
      return;
    }

    try {
      // Check network
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      console.log('Current chainId:', chainId);
      
      // Sepolia test network chainId is 0xaa36a7
      if (chainId !== '0xaa36a7') {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0xaa36a7' }],
          });
        } catch (switchError) {
          // If user doesn't have Sepolia network, add it
          if (switchError.code === 4902) {
            try {
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [{
                  chainId: '0xaa36a7',
                  chainName: 'Sepolia Test Network',
                  nativeCurrency: {
                    name: 'SepoliaETH',
                    symbol: 'ETH',
                    decimals: 18
                  },
                  rpcUrls: ['https://sepolia.infura.io/v3/'],
                  blockExplorerUrls: ['https://sepolia.etherscan.io']
                }],
              });
            } catch (addError) {
              throw new Error('Please manually add the Sepolia test network');
            }
          } else {
            throw switchError;
          }
        }
      }

      // Request wallet connection
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });
      
      // Create contract instance
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = await provider.getSigner();
      console.log('Creating contract instance...');
      const contract = new ethers.Contract(
        LENDING_PLATFORM_ADDRESS,
        MicroLendingPlatform.abi,
        signer
      );
      console.log('Contract instance created');
      
      setAccount(accounts[0]);
      setContract(contract);
      setUserRole('user'); // Default to user role
      
      toast({
        title: "Wallet connected",
        description: `Connected to address: ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      
      await fetchEthPrice();

      // Listen for account changes
      window.ethereum.on('accountsChanged', (newAccounts) => {
        if (newAccounts.length === 0) {
          // User disconnected wallet
          setAccount(null);
          setContract(null);
          setUserRole(null);
          setCurrentView('landing');
          toast({
            title: "Wallet disconnected",
            description: "Your wallet connection has been disconnected",
            status: "info",
            duration: 5000,
            isClosable: true,
          });
        } else {
          // User switched accounts
          setAccount(newAccounts[0]);
          toast({
            title: "Account switched",
            description: `Current account: ${newAccounts[0].slice(0, 6)}...${newAccounts[0].slice(-4)}`,
            status: "info",
            duration: 5000,
            isClosable: true,
          });
        }
      });

      // Listen for network changes
      window.ethereum.on('chainChanged', (newChainId) => {
        if (newChainId !== '0xaa36a7') {
          toast({
            title: "Network error",
            description: "Please switch to the Sepolia test network",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }
        // MetaMask recommends page refresh
        window.location.reload();
      });

    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast({
        title: "Connection error",
        description: error.message || "An error occurred while connecting the wallet",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleRoleSelect = (role) => {
    if (role === 'home') {
      setCurrentView('landing');
    } else {
      setUserRole(role);
      setCurrentView('dashboard');
    }
    toast({
      title: role === 'home' ? 'Welcome to Home' : `Switched to ${role === 'admin' ? 'Admin' : role === 'dao' ? 'DAO Member' : 'User'} mode`,
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
  };

  const renderDisconnectedContent = () => (
    <Box
      p={10}
      borderWidth="1px"
      borderRadius="lg"
      borderColor={borderColor}
      textAlign="center"
      bg={bgColor}
    >
      <VStack spacing={4}>
        <Heading size="md" color={textColor}>
          Please connect your wallet to continue
        </Heading>
        <Text color={textColor}>
          After connecting your wallet, you can use group lending, view loan records, and participate in DAO governance
        </Text>
      </VStack>
    </Box>
  );

  const renderContent = () => {
    if (!account) {
      return renderDisconnectedContent();
    }

    switch (currentView) {
      case 'landing':
        return <LandingPage 
          onStartAssessment={() => setCurrentView('assessment')} 
          onLogin={() => setCurrentView('dashboard')} 
        />;

      case 'assessment':
        return <GroupLending 
          contract={contract} 
          account={account} 
          ethUsdtPrice={ethUsdtPrice} 
        />;

      case 'dashboard':
        if (userRole === 'dao') {
          return <AdminDashboard userRole="dao" />;
        } else {
          return <UserDashboard account={account} />;
        }

      default:
        return (
          <Box
            borderWidth="1px"
            borderRadius="lg"
            borderColor={borderColor}
            overflow="hidden"
            bg={bgColor}
          >
            <Tabs variant="soft-rounded" colorScheme="blue">
              <TabList p={4} bg={tabListBg}>
                <Tab _selected={{ color: 'white', bg: 'blue.500' }}>
                  Group Lending
                </Tab>
                <Tab _selected={{ color: 'white', bg: 'blue.500' }}>
                  My Loans
                </Tab>
                <Tab _selected={{ color: 'white', bg: 'blue.500' }}>
                  DAO Governance
                </Tab>
              </TabList>

              <TabPanels>
                <TabPanel>
                  <GroupLending
                    contract={contract}
                    account={account}
                    ethUsdtPrice={ethUsdtPrice}
                  />
                </TabPanel>
                <TabPanel>
                  <VStack spacing={4} align="stretch">
                    <Heading size="md" color={textColor}>My Loan Records</Heading>
                    <Box
                      p={6}
                      borderWidth="1px"
                      borderRadius="lg"
                      borderColor={borderColor}
                      bg={bgColor}
                    >
                      <Text color={textColor}>No loan records available</Text>
                    </Box>
                  </VStack>
                </TabPanel>
                <TabPanel>
                  <VStack spacing={4} align="stretch">
                    <Heading size="md" color={textColor}>DAO Governance</Heading>
                    <Box
                      p={6}
                      borderWidth="1px"
                      borderRadius="lg"
                      borderColor={borderColor}
                      bg={bgColor}
                    >
                      <Text color={textColor}>Coming soon</Text>
                    </Box>
                  </VStack>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
        );
    }
  };

  const hoverBgColor = useColorModeValue('yellow.50', 'yellow.900');

  return (
    <ChakraProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <Box minH="100vh" bg={bgColor}>
              <Container maxW="container.xl" py={6}>
                <Box
                  borderRadius="xl"
                  bg={bgColor}
                  borderColor={borderColor}
                  borderWidth="1px"
                  boxShadow="xl"
                  position="relative"
                  overflow="hidden"
                  p={6}
                >
                  <Box
                    position="absolute"
                    top="0"
                    right="0"
                    width="300px"
                    height="300px"
                    bgGradient="radial(yellow.50, transparent)"
                    opacity="0.4"
                    transform="translate(30%, -30%)"
                    zIndex="0"
                  />
                  <VStack spacing={6} align="stretch" position="relative" zIndex="1">
                    <Box 
                      display="flex" 
                      justifyContent="space-between" 
                      alignItems="center"
                      mb={2}
                    >
                      <HStack spacing={4}>
                        <Box
                          as="img"
                          src="/A2.png"
                          alt="Base Logo"
                          w="60px"
                          h="60px"
                        />
                        <Heading 
                          size="xl" 
                          bgGradient="linear(to-r, yellow.400, pink.400)"
                          bgClip="text"
                          fontWeight="extrabold"
                        >
                          FortiFi
                        </Heading>
                      </HStack>
                      <HStack spacing={4}>
                        {account && (
                          <Menu>
                            <MenuButton 
                              as={Button} 
                              rightIcon={<ChevronDownIcon />}
                              variant="ghost"
                              bg="yellow.100"
                              _hover={{
                                bg: currentView === 'landing' ? 'yellow.200' : userRole === 'admin' ? 'red.200' : userRole === 'dao' ? 'purple.200' : 'green.200',
                              }}
                              _expanded={{
                                bg: 'yellow.100',
                              }}
                            >
                              {currentView === 'landing' ? 'Home' : 
                               userRole === 'admin' ? 'Admin' : 
                               userRole === 'dao' ? 'DAO Member' : 'User'}
                            </MenuButton>
                            <MenuList bg="yellow.50">
                              <MenuItem 
                                onClick={() => handleRoleSelect('home')}
                                _hover={{ bg: 'yellow.200' }}
                                bg={currentView === 'landing' ? 'yellow.200' : 'yellow.50'}
                              >
                                Home
                              </MenuItem>
                              <MenuItem 
                                onClick={() => handleRoleSelect('user')}
                                _hover={{ bg: 'green.100' }}
                                bg={userRole === 'user' ? 'green.100' : 'yellow.50'}
                              >
                                User
                              </MenuItem>
                              <MenuItem 
                                onClick={() => handleRoleSelect('dao')}
                                _hover={{ bg: 'purple.100' }}
                                bg={userRole === 'dao' ? 'purple.100' : 'yellow.50'}
                              >
                                DAO Member
                              </MenuItem>
                            </MenuList>
                          </Menu>
                        )}
                        <Button
                          onClick={connectWallet}
                          colorScheme="yellow"
                          size="lg"
                          variant="outline"
                          isLoading={isConnecting}
                          loadingText="connecting"
                          _hover={{
                            bg: 'yellow.500',
                            transform: 'translateY(-2px)',
                            boxShadow: 'md',
                          }}
                          transition="all 0.2s"
                        >
                          {account
                            ? `Connected: ${account.slice(0, 6)}...${account.slice(-4)}`
                            : 'Connect Wallet'}
                        </Button>
                      </HStack>
                    </Box>

                    {renderContent()}
                  </VStack>
                </Box>
              </Container>
            </Box>
          } />
          <Route path="/repayment" element={
            <Box minH="100vh" bg={bgColor}>
              <Container maxW="container.xl" py={6}>
                <Repayment 
                  contract={contract}
                  account={account}
                />
              </Container>
            </Box>
          } />
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;