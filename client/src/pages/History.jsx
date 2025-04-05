import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  VStack,
  Heading,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  useToast,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react';
import axios from 'axios';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';

const History = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/transactions', {
        headers: {
          'x-auth-token': localStorage.getItem('token'),
        },
      });
      setTransactions(res.data);
    } catch (err) {
      toast({
        title: 'เกิดข้อผิดพลาด',
        description: 'ไม่สามารถโหลดประวัติการทำรายการได้',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'green';
      case 'pending':
        return 'yellow';
      case 'failed':
        return 'red';
      default:
        return 'gray';
    }
  };

  const TopupHistory = () => (
    <Table variant="simple">
      <Thead>
        <Tr>
          <Th>วันที่</Th>
          <Th>จำนวนเงิน</Th>
          <Th>วิธีการชำระเงิน</Th>
          <Th>สถานะ</Th>
        </Tr>
      </Thead>
      <Tbody>
        {transactions
          .filter((tx) => tx.type === 'topup')
          .map((tx) => (
            <Tr key={tx._id}>
              <Td>
                {format(new Date(tx.createdAt), 'dd MMMM yyyy HH:mm', {
                  locale: th,
                })}
              </Td>
              <Td>฿{tx.amount}</Td>
              <Td>{tx.paymentMethod}</Td>
              <Td>
                <Badge colorScheme={getStatusColor(tx.status)}>
                  {tx.status === 'completed' ? 'สำเร็จ' : 
                   tx.status === 'pending' ? 'รอดำเนินการ' : 'ไม่สำเร็จ'}
                </Badge>
              </Td>
            </Tr>
          ))}
      </Tbody>
    </Table>
  );

  const PurchaseHistory = () => (
    <Table variant="simple">
      <Thead>
        <Tr>
          <Th>วันที่</Th>
          <Th>สินค้า</Th>
          <Th>จำนวนเงิน</Th>
          <Th>สถานะ</Th>
        </Tr>
      </Thead>
      <Tbody>
        {transactions
          .filter((tx) => tx.type === 'purchase')
          .map((tx) => (
            <Tr key={tx._id}>
              <Td>
                {format(new Date(tx.createdAt), 'dd MMMM yyyy HH:mm', {
                  locale: th,
                })}
              </Td>
              <Td>
                <VStack align="start">
                  {tx.products.map((item, index) => (
                    <Text key={index}>
                      {item.product.name} x {item.quantity}
                    </Text>
                  ))}
                </VStack>
              </Td>
              <Td>฿{tx.amount}</Td>
              <Td>
                <Badge colorScheme={getStatusColor(tx.status)}>
                  {tx.status === 'completed' ? 'สำเร็จ' : 
                   tx.status === 'pending' ? 'รอดำเนินการ' : 'ไม่สำเร็จ'}
                </Badge>
              </Td>
            </Tr>
          ))}
      </Tbody>
    </Table>
  );

  return (
    <Container maxW="container.xl" pt={20} pb={10}>
      <VStack spacing={8}>
        <Box textAlign="center">
          <Heading>ประวัติการทำรายการ</Heading>
          <Text mt={2} color="gray.600">
            ประวัติการเติมเงินและการสั่งซื้อทั้งหมดของคุณ
          </Text>
        </Box>

        <Box w="100%" bg="white" p={8} borderRadius="lg" boxShadow="lg">
          <Tabs isFitted variant="enclosed">
            <TabList mb="1em">
              <Tab>ประวัติการสั่งซื้อ</Tab>
              <Tab>ประวัติการเติมเงิน</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <PurchaseHistory />
              </TabPanel>
              <TabPanel>
                <TopupHistory />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </VStack>
    </Container>
  );
};

export default History; 