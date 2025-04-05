import React, { useState } from 'react';
import {
  Container,
  Box,
  VStack,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
  SimpleGrid,
  Text,
  Image,
  Radio,
  RadioGroup,
  Stack,
} from '@chakra-ui/react';
import axios from 'axios';

const PAYMENT_METHODS = [
  {
    id: 'promptpay',
    name: 'PromptPay',
    image: 'https://promptpay.io/assets/img/PromptPay-logo.png',
  },
  {
    id: 'truemoney',
    name: 'TrueMoney Wallet',
    image: 'https://www.truemoney.com/wp-content/uploads/2022/01/truemoney-wallet-logo.png',
  },
];

const Topup = () => {
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('promptpay');
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleTopup = async () => {
    if (!amount || amount <= 0) {
      toast({
        title: 'กรุณาระบุจำนวนเงิน',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        'http://localhost:5001/api/transactions/topup',
        {
          amount: parseFloat(amount),
          paymentMethod,
        },
        {
          headers: {
            'x-auth-token': localStorage.getItem('token'),
          },
        }
      );

      toast({
        title: 'เติมเงินสำเร็จ',
        status: 'success',
        duration: 3000,
      });

      setAmount('');
    } catch (err) {
      toast({
        title: 'เกิดข้อผิดพลาด',
        description: err.response?.data?.message || 'ไม่สามารถทำการเติมเงินได้',
        status: 'error',
        duration: 3000,
      });
    }
    setLoading(false);
  };

  return (
    <Container maxW="container.md" pt={20} pb={10}>
      <VStack spacing={8}>
        <Box textAlign="center">
          <Heading>เติมเงิน</Heading>
          <Text mt={2} color="gray.600">
            เลือกจำนวนเงินและวิธีการชำระเงิน
          </Text>
        </Box>

        <Box w="100%" bg="white" p={8} borderRadius="lg" boxShadow="lg">
          <VStack spacing={6}>
            <FormControl>
              <FormLabel>จำนวนเงิน</FormLabel>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="ระบุจำนวนเงิน"
              />
            </FormControl>

            <FormControl>
              <FormLabel>วิธีการชำระเงิน</FormLabel>
              <RadioGroup value={paymentMethod} onChange={setPaymentMethod}>
                <Stack direction="column" spacing={4}>
                  {PAYMENT_METHODS.map((method) => (
                    <Radio key={method.id} value={method.id}>
                      <Stack direction="row" align="center" spacing={4}>
                        <Image
                          src={method.image}
                          alt={method.name}
                          boxSize="30px"
                          objectFit="contain"
                        />
                        <Text>{method.name}</Text>
                      </Stack>
                    </Radio>
                  ))}
                </Stack>
              </RadioGroup>
            </FormControl>

            <Button
              colorScheme="blue"
              w="100%"
              onClick={handleTopup}
              isLoading={loading}
            >
              ยืนยันการเติมเงิน
            </Button>
          </VStack>
        </Box>

        <SimpleGrid columns={{ base: 2, md: 3 }} spacing={4} w="100%">
          {[100, 200, 300, 500, 1000, 2000].map((preset) => (
            <Button
              key={preset}
              onClick={() => setAmount(preset.toString())}
              variant="outline"
            >
              ฿{preset}
            </Button>
          ))}
        </SimpleGrid>
      </VStack>
    </Container>
  );
};

export default Topup; 