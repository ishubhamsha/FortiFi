import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Stepper,
  Step,
  StepIndicator,
  StepStatus,
  StepIcon,
  StepNumber,
  StepTitle,
  StepDescription,
  useSteps,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  useToast,
  Card,
  CardBody,
  Badge,
  IconButton,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Progress,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Grid,
  GridItem,
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon, AttachmentIcon } from '@chakra-ui/icons';

const steps = [
  // { title: 'Group Application', description: 'Form a group of 5-10 people and submit a collective application' },
  { title: 'AI Interview', description: 'AI Agent conducts individual and cross-interviews' },
  { title: 'DAO Approval', description: 'Community voting decision and smart contract lending' },
  { title: 'Repayment Management', description: 'Installment repayment and credit record management' },
];

const GroupLending = ({ contract, account, ethUsdtPrice }) => {
  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  });
  const [groupMembers, setGroupMembers] = useState([{ name: '', role: '', background: '' }]);
  const [groupPurpose, setGroupPurpose] = useState('');
  const [loanAmount, setLoanAmount] = useState('');
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const bgColor = useColorModeValue('yellow.100', 'yellow.700');
  const borderColor = useColorModeValue('yellow.200', 'yellow.800');
  const textColor = useColorModeValue('yellow.500', 'yellow.300');
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const videoRef = React.useRef(null);
  const streamRef = React.useRef(null);
  const [isCameraLoading, setIsCameraLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const canvasRef = React.useRef(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [interviewQuestions, setInterviewQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [interviewResponses, setInterviewResponses] = useState({});
  const [creditScore, setCreditScore] = useState(null);
  const [isInterviewComplete, setIsInterviewComplete] = useState(false);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    // Fetch interview questions when component mounts
    const fetchQuestions = async () => {
      try {
        const response = await fetch('http://localhost:8000/interview-questions');
        const data = await response.json();
        setInterviewQuestions(data.questions);
        // Initialize responses object
        const initialResponses = {};
        data.questions.forEach((q, index) => {
          initialResponses[`q${index}`] = '';
        });
        setInterviewResponses(initialResponses);
      } catch (error) {
        console.error('Error fetching questions:', error);
        toast({
          title: "Error",
          description: "Failed to load interview questions",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    };
    fetchQuestions();
  }, []);

  const startCamera = async () => {
    setIsCameraLoading(true);
    setHasError(false);
    setPreviewImage(null);
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        
        // Wait for video to be loaded
        await new Promise((resolve) => {
          videoRef.current.onloadeddata = () => {
            resolve();
          };
        });

        await videoRef.current.play();
        setShowPreview(true);
      }
    } catch (err) {
      console.error('Camera error:', err);
      setHasError(true);
      toast({
        title: "Camera Access Error",
        description: "Please allow camera access and make sure no other app is using the camera",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsCameraLoading(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas size to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      
      // Clear canvas and draw video frame
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(-1, 1); // Mirror effect
      ctx.translate(-canvas.width, 0);
      ctx.drawImage(video, 0, 0);
      ctx.restore();
      
      // Get image data
      const imageData = canvas.toDataURL('image/jpeg');
      setCapturedImage(imageData);
      setPreviewImage(imageData);
      
      // Stop camera stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      setShowPreview(false);
      toast({
        title: "Photo Captured",
        description: "Face verification completed successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      
      setTimeout(() => {
        setShowCamera(false);
        setActiveStep(2);
      }, 1500);
    }
  };

  const addMember = () => {
    if (groupMembers.length < 10) {
      setGroupMembers([...groupMembers, { name: '', role: '', background: '' }]);
    } else {
      toast({
        title: "Member Limit Reached",
        description: "A group can have a maximum of 10 members",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });      
    }
  };

  const removeMember = (index) => {
    if (groupMembers.length > 1) {
      const newMembers = groupMembers.filter((_, i) => i !== index);
      setGroupMembers(newMembers);
    }
  };

  const updateMember = (index, field, value) => {
    const newMembers = [...groupMembers];
    newMembers[index] = { ...newMembers[index], [field]: value };
    setGroupMembers(newMembers);
  };

  const handleSubmit = () => {
    // Validate form
    if (!loanAmount || !groupPurpose || !groupMembers[0].name) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Store the application data in state if needed
    const applicationData = {
      loanAmount,
      groupPurpose,
      groupMembers,
    };

    // Directly proceed to camera verification
    toast({
      title: "Application Ready",
      description: "Please complete face verification",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
    
    setShowCamera(true);
    startCamera();
    setActiveStep(1);
  };

  const simulateAIInterview = () => {
    setTimeout(() => {
      toast({
        title: "AI Interview Completed",
        description: "The AI interview has been completed. Proceeding to DAO approval.",
        status: "info",
        duration: 5000,
        isClosable: true,
      });
      setActiveStep(2);
    }, 10000); // Simulate a 10-second delay for the AI interview
  };

  const handleAnswerSubmit = async () => {
    if (!interviewResponses[`q${currentQuestionIndex}`]) {
      toast({
        title: "Validation Error",
        description: "Please provide an answer before proceeding",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (currentQuestionIndex < interviewQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // All questions answered, calculate credit score
      try {
        const response = await fetch('http://localhost:8000/assess-credit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            wallet_address: account || '', // Add fallback empty string
            responses: interviewResponses,
            on_chain_data: {
              previous_loans_repaid: 0, // This should come from blockchain
              collateral_ratio: 0,      // This should come from blockchain
              wallet_age_years: 1       // This should come from blockchain
            },
            dao_scores: [0] // This should come from DAO
          }),
        });
        const data = await response.json();
        setCreditScore(data);
        setIsInterviewComplete(true);
        toast({
          title: "Interview Complete",
          description: "Your credit assessment has been completed",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        // Proceed to DAO approval after a delay
        setTimeout(() => {
          setActiveStep(2);
        }, 3000);
      } catch (error) {
        console.error('Error calculating credit score:', error);
        toast({
          title: "Error",
          description: "Failed to calculate credit score",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <VStack spacing={6} align="stretch">
            <Card bg={bgColor} borderColor={borderColor} borderWidth="1px">
              <CardBody>
                <VStack spacing={4}>
                  <FormControl isRequired>
                    <FormLabel color={textColor}>Loan Amount (USDT)</FormLabel>
                    <Input
                      type="number"
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(e.target.value)}
                      placeholder="Enter the requested loan amount"
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel color={textColor}>Loan Purpose</FormLabel>
                    <Textarea
                      value={groupPurpose}
                      onChange={(e) => setGroupPurpose(e.target.value)}
                      placeholder="Describe the loan purpose and expected benefits"
                    />
                  </FormControl>
                </VStack>
              </CardBody>
            </Card>

            <Card bg={bgColor} borderColor={borderColor} borderWidth="1px">
              <CardBody>
                <VStack spacing={4}>
                  <HStack justify="space-between" width="100%">
                    <Heading size="md" color={textColor}>Group Members</Heading>
                    <Button
                      leftIcon={<AddIcon />}
                      colorScheme="blue"
                      onClick={addMember}
                      size="sm"
                    >
                      Add Member
                    </Button>
                  </HStack>
                  {groupMembers.map((member, index) => (
                    <Box
                      key={index}
                      p={4}
                      borderWidth="1px"
                      borderRadius="lg"
                      width="100%"
                      bg={bgColor}
                      borderColor={borderColor}
                    >
                      <Grid templateColumns="repeat(6, 1fr)" gap={4}>
                        <GridItem colSpan={2}>
                          <FormControl isRequired>
                            <FormLabel color={textColor}>Name</FormLabel>
                            <Input
                              value={member.name}
                              onChange={(e) => updateMember(index, 'name', e.target.value)}
                              placeholder="Member Name"
                            />
                          </FormControl>
                        </GridItem>
                        <GridItem colSpan={2}>
                          <FormControl isRequired>
                            <FormLabel color={textColor}>Role</FormLabel>
                            <Input
                              value={member.role}
                              onChange={(e) => updateMember(index, 'role', e.target.value)}
                              placeholder="Role in the group"
                            />
                          </FormControl>
                        </GridItem>
                        <GridItem colSpan={2}>
                          <FormControl>
                            <FormLabel color={textColor}>Background</FormLabel>
                            <Input
                              value={member.background}
                              onChange={(e) => updateMember(index, 'background', e.target.value)}
                              placeholder="Relevant skills and experience"
                            />
                          </FormControl>
                        </GridItem>
                      </Grid>
                      {index > 0 && (
                        <IconButton
                          icon={<DeleteIcon />}
                          colorScheme="red"
                          variant="ghost"
                          size="sm"
                          position="absolute"
                          right="2"
                          top="2"
                          onClick={() => removeMember(index)}
                        />
                      )}
                    </Box>
                  ))}
                </VStack>
              </CardBody>
            </Card>

            <Card bg={bgColor} borderColor={borderColor} borderWidth="1px">
              <CardBody>
                <VStack spacing={4}>
                  <Heading size="md" color={textColor}>Supporting Documents</Heading>
                  <Button
                    leftIcon={<AttachmentIcon />}
                    colorScheme="green"
                    variant="outline"
                    onClick={onOpen}
                  >
                    Upload Supporting Documents
                  </Button>
                  <Text fontSize="sm" color="gray.500">
                    Allowed uploads: Skill certificates, credit records, income proof, etc.
                  </Text>
                </VStack>
              </CardBody>
            </Card>

            <Button colorScheme="blue" size="lg" onClick={handleSubmit}>
              Submit Group Application
            </Button>
          </VStack>
        );
      case 1:
        return (
          <Card bg="black" borderColor={borderColor} borderWidth="1px">
            <CardBody>
              <VStack spacing={6}>
                {!isInterviewComplete ? (
                  <>
                    <Heading size="md" color="yellow.400">AI Interview</Heading>
                    <Box width="100%" p={4} borderRadius="lg" bg="yellow.900" borderWidth="1px" borderColor="yellow.500">
                      <Text color="yellow.400" fontWeight="bold" mb={2}>
                        Progress: {currentQuestionIndex + 1} of {interviewQuestions.length}
                      </Text>
                      <Progress 
                        value={(currentQuestionIndex + 1) / interviewQuestions.length * 100} 
                        size="sm" 
                        colorScheme="yellow" 
                        mb={4}
                      />
                    </Box>
                    <Box width="100%" p={6} borderRadius="lg" bg="black" borderWidth="1px" borderColor="yellow.500">
                      <Text fontSize="lg" fontWeight="bold" color="yellow.400" mb={4}>
                        {interviewQuestions[currentQuestionIndex]}
                      </Text>
                      <FormControl>
                        <Textarea
                          value={interviewResponses[`q${currentQuestionIndex}`]}
                          onChange={(e) => setInterviewResponses(prev => ({
                            ...prev,
                            [`q${currentQuestionIndex}`]: e.target.value
                          }))}
                          placeholder="Type your answer here..."
                          size="lg"
                          rows={6}
                          bg="yellow.900"
                          color="yellow.100"
                          border="2px"
                          borderColor="yellow.500"
                          _hover={{
                            borderColor: "yellow.400"
                          }}
                          _focus={{
                            borderColor: "yellow.300",
                            boxShadow: "0 0 0 1px yellow.300"
                          }}
                          mb={4}
                        />
                      </FormControl>
                      <HStack justify="space-between" width="100%">
                        <Button
                          variant="outline"
                          colorScheme="yellow"
                          onClick={() => currentQuestionIndex > 0 && setCurrentQuestionIndex(prev => prev - 1)}
                          isDisabled={currentQuestionIndex === 0}
                        >
                          Previous
                        </Button>
                        <Button
                          colorScheme="yellow"
                          onClick={handleAnswerSubmit}
                          rightIcon={currentQuestionIndex === interviewQuestions.length - 1 ? undefined : <AddIcon />}
                        >
                          {currentQuestionIndex === interviewQuestions.length - 1 ? 'Submit Interview' : 'Next Question'}
                        </Button>
                      </HStack>
                    </Box>
                    {/* Show previous questions and answers */}
                    {currentQuestionIndex > 0 && (
                      <Box width="100%" mt={4}>
                        <Text color="yellow.400" fontWeight="bold" mb={2}>Previous Responses:</Text>
                        <VStack spacing={4} align="stretch">
                          {Array.from({ length: currentQuestionIndex }).map((_, index) => (
                            <Box 
                              key={index} 
                              p={4} 
                              borderRadius="md" 
                              bg="yellow.900"
                              borderWidth="1px"
                              borderColor="yellow.500"
                              opacity={0.8}
                            >
                              <Text color="yellow.400" fontWeight="bold">
                                Q{index + 1}: {interviewQuestions[index]}
                              </Text>
                              <Text color="yellow.100" mt={2}>
                                {interviewResponses[`q${index}`]}
                              </Text>
                            </Box>
                          ))}
                        </VStack>
                      </Box>
                    )}
                  </>
                ) : creditScore && (
                  <>
                    <Heading size="md" color={textColor}>Credit Assessment Results</Heading>
                    <Grid templateColumns="repeat(3, 1fr)" gap={4} width="full">
                      <Stat>
                        <StatLabel color={textColor}>Text Score</StatLabel>
                        <StatNumber color={textColor}>{creditScore.text_score.toFixed(1)}/40</StatNumber>
                      </Stat>
                      <Stat>
                        <StatLabel color={textColor}>Chain Score</StatLabel>
                        <StatNumber color={textColor}>{creditScore.chain_score.toFixed(1)}/30</StatNumber>
                      </Stat>
                      <Stat>
                        <StatLabel color={textColor}>DAO Score</StatLabel>
                        <StatNumber color={textColor}>{creditScore.dao_score.toFixed(1)}/30</StatNumber>
                      </Stat>
                    </Grid>
                    <Stat>
                      <StatLabel color={textColor}>Final Credit Score</StatLabel>
                      <StatNumber color={textColor}>{creditScore.final_score.toFixed(1)}/100</StatNumber>
                      <StatHelpText color={textColor}>
                        Risk Level: {creditScore.risk_level}
                      </StatHelpText>
                    </Stat>
                    <Text color={textColor}>
                      Proceeding to DAO approval...
                    </Text>
                  </>
                )}
              </VStack>
            </CardBody>
          </Card>
        );
      case 2:
        return (
          <Card bg={bgColor} borderColor={borderColor} borderWidth="1px">
            <CardBody>
              <VStack spacing={6}>
                <Heading size="md" color={textColor}>DAO Approval</Heading>
                <Text color={textColor}>The community is voting on your loan application. Please wait for the results...</Text>
                <Progress size="sm" isIndeterminate colorScheme="blue" width="100%" />
              </VStack>
            </CardBody>
          </Card>
        );
      // Additional steps can be added as needed
      default:
        return null;
    }
  };
  const CameraModal = () => (
    <Modal 
      isOpen={showCamera} 
      onClose={() => {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
        setShowCamera(false);
        setShowPreview(false);
        setPreviewImage(null);
      }} 
      size="xl"
      closeOnOverlayClick={false}
    >
      <ModalOverlay />
      <ModalContent maxW="800px">
        <ModalHeader>Face Verification</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <VStack spacing={4}>
            <Box 
              borderWidth={1} 
              borderRadius="lg" 
              overflow="hidden" 
              position="relative"
              width="100%"
              height="400px"
              bg="gray.100"
            >
              {isCameraLoading && (
                <VStack justify="center" height="100%" position="absolute" width="100%" zIndex={2}>
                  <Progress size="xs" isIndeterminate width="80%" />
                  <Text>Initializing camera...</Text>
                </VStack>
              )}
              {hasError ? (
                <VStack justify="center" height="100%">
                  <Text>Camera access failed. Please check your permissions.</Text>
                  <Button onClick={startCamera}>Retry</Button>
                </VStack>
              ) : (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transform: 'scaleX(-1)',
                      display: showPreview && !previewImage ? 'block' : 'none'
                    }}
                  />
                  {previewImage && (
                    <img 
                      src={previewImage}
                      alt="Captured"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  )}
                  <canvas ref={canvasRef} style={{ display: 'none' }} />
                </>
              )}
            </Box>
            <Button 
              colorScheme="blue" 
              onClick={previewImage ? startCamera : capturePhoto}
              isDisabled={isCameraLoading || (hasError && !previewImage)}
              width="100%"
            >
              {previewImage ? 'Retake Photo' : 'Capture Photo'}
            </Button>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );

  return (
    <Container maxW="container.xl" py={10}>
      <VStack spacing={8}>
        <Stepper index={activeStep} width="100%">
          {steps.map((step, index) => (
            <Step key={index}>
              <StepIndicator>
                <StepStatus
                  complete={<StepIcon />}
                  incomplete={<StepNumber />}
                  active={<StepNumber />}
                />
              </StepIndicator>
              <Box flexShrink='0'>
                <StepTitle color={textColor}>{step.title}</StepTitle>
                <StepDescription color={textColor}>{step.description}</StepDescription>
              </Box>
            </Step>
          ))}
        </Stepper>

        {renderStepContent()}
      </VStack>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Upload Supporting Documents</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {/* File upload component */}
          </ModalBody>
        </ModalContent>
      </Modal>
      <CameraModal />
    </Container>
  );
};

GroupLending.propTypes = {
  contract: PropTypes.object,
  account: PropTypes.string,
  ethUsdtPrice: PropTypes.number
};

GroupLending.defaultProps = {
  contract: null,
  account: '',
  ethUsdtPrice: null
};

export default GroupLending;
