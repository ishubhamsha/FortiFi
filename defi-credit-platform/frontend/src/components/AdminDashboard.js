import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  Progress,
  SimpleGrid,
  Avatar,
  Badge,
  useToast,
  Container,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  useColorModeValue,
  Divider,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaClock, FaVoteYea } from 'react-icons/fa';
import PendingLoans from './PendingLoans';
import PlatformStatistics from './PlatformStatistics';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = ({ userRole }) => {
  const navigate = useNavigate();
  const [votes, setVotes] = useState(0);
  const [isApproved, setIsApproved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentView, setCurrentView] = useState('main');
  const toast = useToast();
  const bgColor = useColorModeValue('black', 'black');
  const borderColor = useColorModeValue('yellow.200', 'yellow.800');
  const textColor = useColorModeValue('yellow.500', 'yellow.300');
  const [applications, setApplications] = useState([
    {
      id: 1,
      groupName: "Entrepreneur Group A",
      amount: "5000",
      members: 5,
      purpose: "Small business expansion",
      votes: {
        approve: {},
        reject: {}
      },
      status: 'pending',
      votesCount: {
        approve: 0,
        reject: 0
      }
    },
    {
      id: 2,
      groupName: "Women's Co-op B",
      amount: "7500",
      members: 7,
      purpose: "Agricultural equipment",
      votes: {
        approve: {},
        reject: {}
      },
      status: 'pending',
      votesCount: {
        approve: 0,
        reject: 0
      }
    },
    {
      id: 3,
      groupName: "Tech Startup C",
      amount: "10000",
      members: 4,
      purpose: "Software development tools",
      votes: {
        approve: {},
        reject: {}
      },
      status: 'pending',
      votesCount: {
        approve: 0,
        reject: 0
      }
    },
    {
      id: 4,
      groupName: "Local Artisans D",
      amount: "3000",
      members: 6,
      purpose: "Workshop equipment",
      votes: {
        approve: {},
        reject: {}
      },
      status: 'pending',
      votesCount: {
        approve: 0,
        reject: 0
      }
    }
  ]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [memberVotes, setMemberVotes] = useState({});

  const daoMembers = [
    { id: 1, name: 'Alice', hasVoted: false, address: '0x1234...5678' },
    { id: 2, name: 'Bob', hasVoted: false, address: '0x8765...4321' },
    { id: 3, name: 'Charlie', hasVoted: false, address: '0x9876...1234' },
    { id: 4, name: 'David', hasVoted: false, address: '0x4567...8901' },
    { id: 5, name: 'Eve', hasVoted: false, address: '0x2345...6789' },
  ];

  const handleVote = async (memberId, voteType, applicationId) => {
    setLoading(true);
    
    setApplications(prevApps => {
      return prevApps.map(app => {
        if (app.id === applicationId) {
          const newVotesCount = {
            approve: voteType === 'approve' ? app.votesCount.approve + 1 : app.votesCount.approve,
            reject: voteType === 'reject' ? app.votesCount.reject + 1 : app.votesCount.reject
          };

          toast({
            title: 'Vote Submitted',
            description: 'Your vote has been recorded',
            status: 'success',
            duration: 3000,
          });

          let newStatus = app.status;
          if (newVotesCount.approve >= 4) {
            newStatus = 'approved';
            toast({
              title: 'Loan Approved',
              description: 'DAO members have approved the loan',
              status: 'success',
              duration: 5000,
            });
            setTimeout(() => {
              navigate('/repayment', { state: { application: app } });
            }, 2000);
          } else if (newVotesCount.reject >= 4) {
            newStatus = 'rejected';
            toast({
              title: 'Loan Rejected',
              description: 'DAO members have rejected the loan',
              status: 'error',
              duration: 5000,
            });
          }

          return {
            ...app,
            votesCount: newVotesCount,
            status: newStatus,
            votes: {
              ...app.votes,
              [voteType]: { ...app.votes[voteType], [memberId || Date.now()]: true }
            }
          };
        }
        return app;
      });
    });

    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
  };

  const handleMemberVote = async (memberId, applicationId, voteType) => {
    setLoading(true);
    
    setApplications(prevApps => {
      return prevApps.map(app => {
        if (app.id === applicationId) {
          if (app.votes.approve[memberId] || app.votes.reject[memberId]) {
            toast({
              title: "Already Voted",
              description: "You have already voted on this application",
              status: "warning",
              duration: 2000,
            });
            return app;
          }

          const newVotesCount = {
            approve: voteType === 'approve' ? app.votesCount.approve + 1 : app.votesCount.approve,
            reject: voteType === 'reject' ? app.votesCount.reject + 1 : app.votesCount.reject
          };

          toast({
            title: 'Vote Submitted',
            description: 'Your vote has been recorded',
            status: 'success',
            duration: 3000,
          });

          let newStatus = app.status;
          if (newVotesCount.approve >= 4) {
            newStatus = 'approved';
            toast({
              title: 'Loan Approved',
              description: 'DAO members have approved the loan',
              status: 'success',
              duration: 5000,
            });
            setTimeout(() => {
              navigate('/repayment', { state: { application: app } });
            }, 2000);
          }

          return {
            ...app,
            votesCount: newVotesCount,
            status: newStatus,
            votes: {
              ...app.votes,
              [voteType]: { ...app.votes[voteType], [memberId]: true }
            }
          };
        }
        return app;
      });
    });

    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
  };

  const handleSelectApplication = (application) => {
    setSelectedApplication(application);
    setCurrentView('application-detail');
  };

  const getMemberVoteStatus = (member, application) => {
    if (application.votes.approve[member.id]) return 'approved';
    if (application.votes.reject[member.id]) return 'rejected';
    return 'not-voted';
  };

  const renderMemberVoteButtons = (member, application) => {
    const voteKey = `${member.id}-${application.id}`;
    const hasVoted = memberVotes[voteKey];
    
    return (
      <HStack spacing={2}>
        <Button
          size="sm"
          colorScheme="green"
          isDisabled={hasVoted || application.status !== 'pending'}
          onClick={() => handleMemberVote(member.id, application.id, 'approve')}
          opacity={hasVoted === 'approve' ? 1 : 0.7}
        >
          Approve
        </Button>
        <Button
          size="sm"
          colorScheme="red"
          isDisabled={hasVoted || application.status !== 'pending'}
          onClick={() => handleMemberVote(member.id, application.id, 'reject')}
          opacity={hasVoted === 'reject' ? 1 : 0.7}
        >
          Reject
        </Button>
      </HStack>
    );
  };

  const renderVotingStatus = (application) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box
        p={6}
        borderWidth="1px"
        borderRadius="lg"
        bg={bgColor}
        borderColor={borderColor}
      >
        <VStack spacing={4} align="stretch">
          <HStack justify="space-between">
            <Heading size="lg" color={textColor}>DAO Approval Status</Heading>
            <Badge
              colorScheme={application.status === 'approved' ? 'green' : 
                          application.status === 'rejected' ? 'red' : 'yellow'}
              p={2}
              borderRadius="full"
              display="flex"
              alignItems="center"
            >
              {application.status === 'approved' ? <FaCheckCircle /> : 
               application.status === 'rejected' ? <FaCheckCircle /> : <FaClock />}
              <Text ml={2}>
                {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
              </Text>
            </Badge>
          </HStack>

          <Box>
            <Text mb={2} color={textColor}>Approve Votes</Text>
            <Progress 
              value={(Object.keys(application.votes.approve).length / 4) * 100} 
              colorScheme="green"
              size="sm"
              mb={2}
            />
            <Text color="green.400" fontSize="sm" textAlign="right">
              {Object.keys(application.votes.approve).length}/4 needed
            </Text>
          </Box>

          <Box>
            <Text mb={2} color={textColor}>Reject Votes</Text>
            <Progress 
              value={(Object.keys(application.votes.reject).length / 4) * 100} 
              colorScheme="red"
              size="sm"
              mb={2}
            />
            <Text color="red.400" fontSize="sm" textAlign="right">
              {Object.keys(application.votes.reject).length}/4 needed
            </Text>
          </Box>
        </VStack>
      </Box>
    </motion.div>
  );

  const renderApplicationCard = (application) => (
    <Box
      p={6}
      borderWidth="1px"
      borderRadius="lg"
      bg={bgColor}
      borderColor={application.status === 'approved' ? 'green.500' : 
                   application.status === 'rejected' ? 'red.500' : 
                   borderColor}
    >
      <VStack spacing={4} align="stretch">
        <Heading size="md" color={textColor}>{application.groupName}</Heading>
        <Text color={textColor}>Amount: {application.amount} USDT</Text>
        <Text color={textColor}>Members: {application.members}</Text>
        <Text color={textColor}>Purpose: {application.purpose}</Text>
        
        {/* Add vote details */}
        <Box borderWidth="1px" borderRadius="md" p={3}>
          <Text color={textColor} fontWeight="bold">Vote Summary:</Text>
          <VStack align="stretch" mt={2}>
            <HStack justify="space-between">
              <Text color="green.400">Approvals:</Text>
              <Text color="green.400">{Object.keys(application.votes.approve).length}/4</Text>
            </HStack>
            <HStack justify="space-between">
              <Text color="red.400">Rejections:</Text>
              <Text color="red.400">{Object.keys(application.votes.reject).length}/4</Text>
            </HStack>
          </VStack>
        </Box>

        <Progress 
          value={(Object.keys(application.votes.approve).length / 4) * 100} 
          colorScheme={application.status === 'approved' ? 'green' : 
                      application.status === 'rejected' ? 'red' : 
                      'yellow'} 
        />
        
        <HStack spacing={4}>
          <Button
            colorScheme="green"
            onClick={() => handleVote(null, 'approve', application.id)}
            isDisabled={application.status !== 'pending'}
            isLoading={loading}
            flex={1}
          >
            Approve ({Object.keys(application.votes.approve).length})
          </Button>
          <Button
            colorScheme="red"
            onClick={() => handleVote(null, 'reject', application.id)}
            isDisabled={application.status !== 'pending'}
            isLoading={loading}
            flex={1}
          >
            Reject ({Object.keys(application.votes.reject).length})
          </Button>
        </HStack>

        <HStack justify="space-between">
          <Badge
            colorScheme={application.status === 'approved' ? 'green' : 
                        application.status === 'rejected' ? 'red' : 'yellow'}
            p={2}
            borderRadius="full"
          >
            {application.status.toUpperCase()}
          </Badge>
          <Text color={textColor}>
            Votes: {Object.keys(application.votes.approve).length}/{daoMembers.length}
          </Text>
        </HStack>
      </VStack>
    </Box>
  );

  const renderContent = () => {
    switch(currentView) {
      case 'application-detail':
        return renderApplicationDetail();
      case 'loans':
        return <PendingLoans />;
      case 'stats':
        return <PlatformStatistics />;
      default:
        return (
          <VStack spacing={8} align="stretch">
            <Heading size="lg" color={textColor}>
              {userRole === 'admin' ? 'Admin Dashboard' : 'DAO Member Dashboard'}
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              {applications.map(app => (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Box
                    p={6}
                    borderWidth="1px"
                    borderRadius="lg"
                    bg={bgColor}
                    borderColor={borderColor}
                    cursor="pointer"
                    onClick={() => handleSelectApplication(app)}
                    _hover={{ transform: 'scale(1.02)' }}
                    transition="all 0.2s"
                  >
                    <VStack spacing={4} align="stretch">
                      <Heading size="md" color={textColor}>{app.groupName}</Heading>
                      <Text color={textColor}>Amount: {app.amount} USDT</Text>
                      <Text color={textColor}>Members: {app.members}</Text>
                      <Text color={textColor}>Purpose: {app.purpose}</Text>
                      <Badge colorScheme={
                        app.status === 'approved' ? 'green' :
                        app.status === 'rejected' ? 'red' : 'yellow'
                      }>
                        {app.status.toUpperCase()}
                      </Badge>
                    </VStack>
                  </Box>
                </motion.div>
              ))}
            </SimpleGrid>
          </VStack>
        );
    }
  };

  const renderApplicationDetail = () => {
    if (!selectedApplication) return null;

    return (
      <VStack spacing={6} align="stretch">
        <HStack justify="space-between">
          <Button colorScheme="yellow" onClick={() => setCurrentView('main')}>
            Back to Applications
          </Button>
          <Heading size="lg" color={textColor}>{selectedApplication.groupName}</Heading>
        </HStack>

        {renderVotingStatus(selectedApplication)}

        <Box p={6} borderWidth="1px" borderRadius="lg" bg={bgColor} borderColor={borderColor}>
          <VStack spacing={4} align="stretch">
            <Text color={textColor}>Amount: {selectedApplication.amount} USDT</Text>
            <Text color={textColor}>Members: {selectedApplication.members}</Text>
            <Text color={textColor}>Purpose: {selectedApplication.purpose}</Text>
            
            <Heading size="md" color={textColor} mt={4}>DAO Member Votes</Heading>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              {daoMembers.map(member => {
                const voteStatus = getMemberVoteStatus(member, selectedApplication);
                return (
                  <Box 
                    key={member.id} 
                    p={4} 
                    borderWidth="1px" 
                    borderRadius="lg"
                    bg={bgColor}
                  >
                    <VStack spacing={3}>
                      <Avatar name={member.name} />
                      <Text color={textColor} fontWeight="bold">{member.name}</Text>
                      <Text color={textColor} fontSize="sm">{member.address}</Text>
                      {selectedApplication.status === 'pending' ? (
                        <HStack spacing={2}>
                          <Button
                            size="sm"
                            colorScheme="green"
                            onClick={() => handleMemberVote(member.id, selectedApplication.id, 'approve')}
                            isLoading={loading}
                            isDisabled={voteStatus !== 'not-voted'}
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            colorScheme="red"
                            onClick={() => handleMemberVote(member.id, selectedApplication.id, 'reject')}
                            isLoading={loading}
                            isDisabled={voteStatus !== 'not-voted'}
                          >
                            Reject
                          </Button>
                        </HStack>
                      ) : (
                        <Badge colorScheme={
                          voteStatus === 'approved' ? 'green' :
                          voteStatus === 'rejected' ? 'red' : 'gray'
                        }>
                          {voteStatus === 'approved' ? 'Approved' :
                           voteStatus === 'rejected' ? 'Rejected' : 'Not Voted'}
                        </Badge>
                      )}
                    </VStack>
                  </Box>
                );
              })}
            </SimpleGrid>
          </VStack>
        </Box>
      </VStack>
    );
  };

  return (
    <Container maxW="container.xl" py={8}>
      {renderContent()}
    </Container>
  );
};

export default AdminDashboard;
