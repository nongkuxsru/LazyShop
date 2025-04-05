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
  Button,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  useDisclosure,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  HStack,
  IconButton,
} from '@chakra-ui/react';
import { AddIcon, EditIcon, DeleteIcon } from '@chakra-ui/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchProducts();
    fetchUsers();
  }, [navigate]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/products');
      setProducts(res.data);
    } catch (err) {
      toast({
        title: 'เกิดข้อผิดพลาด',
        description: 'ไม่สามารถโหลดข้อมูลสินค้าได้',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/users', {
        headers: {
          'x-auth-token': localStorage.getItem('token'),
        },
      });
      setUsers(res.data);
    } catch (err) {
      toast({
        title: 'เกิดข้อผิดพลาด',
        description: 'ไม่สามารถโหลดข้อมูลผู้ใช้ได้',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const productData = {
      name: formData.get('name'),
      description: formData.get('description'),
      price: parseFloat(formData.get('price')),
      stock: parseInt(formData.get('stock')),
      image: formData.get('image'),
      category: formData.get('category'),
    };

    try {
      if (selectedProduct) {
        await axios.put(
          `http://localhost:5001/api/products/${selectedProduct._id}`,
          productData,
          {
            headers: {
              'x-auth-token': localStorage.getItem('token'),
            },
          }
        );
      } else {
        await axios.post('http://localhost:5001/api/products', productData, {
          headers: {
            'x-auth-token': localStorage.getItem('token'),
          },
        });
      }

      toast({
        title: selectedProduct ? 'แก้ไขสินค้าสำเร็จ' : 'เพิ่มสินค้าสำเร็จ',
        status: 'success',
        duration: 3000,
      });

      onClose();
      fetchProducts();
    } catch (err) {
      toast({
        title: 'เกิดข้อผิดพลาด',
        description: err.response?.data?.message || 'ไม่สามารถบันทึกข้อมูลได้',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('คุณแน่ใจหรือไม่ที่จะลบสินค้านี้?')) return;

    try {
      await axios.delete(`http://localhost:5001/api/products/${id}`, {
        headers: {
          'x-auth-token': localStorage.getItem('token'),
        },
      });

      toast({
        title: 'ลบสินค้าสำเร็จ',
        status: 'success',
        duration: 3000,
      });

      fetchProducts();
    } catch (err) {
      toast({
        title: 'เกิดข้อผิดพลาด',
        description: 'ไม่สามารถลบสินค้าได้',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const ProductModal = () => (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {selectedProduct ? 'แก้ไขสินค้า' : 'เพิ่มสินค้าใหม่'}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>ชื่อสินค้า</FormLabel>
                <Input
                  name="name"
                  defaultValue={selectedProduct?.name}
                  placeholder="ระบุชื่อสินค้า"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>รายละเอียด</FormLabel>
                <Textarea
                  name="description"
                  defaultValue={selectedProduct?.description}
                  placeholder="ระบุรายละเอียดสินค้า"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>ราคา</FormLabel>
                <Input
                  name="price"
                  type="number"
                  defaultValue={selectedProduct?.price}
                  placeholder="ระบุราคา"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>จำนวนคงเหลือ</FormLabel>
                <Input
                  name="stock"
                  type="number"
                  defaultValue={selectedProduct?.stock}
                  placeholder="ระบุจำนวนคงเหลือ"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>รูปภาพ (URL)</FormLabel>
                <Input
                  name="image"
                  defaultValue={selectedProduct?.image}
                  placeholder="ระบุ URL รูปภาพ"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>หมวดหมู่</FormLabel>
                <Input
                  name="category"
                  defaultValue={selectedProduct?.category}
                  placeholder="ระบุหมวดหมู่"
                />
              </FormControl>
              <Button type="submit" colorScheme="blue" w="100%">
                {selectedProduct ? 'บันทึกการแก้ไข' : 'เพิ่มสินค้า'}
              </Button>
            </VStack>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );

  return (
    <Container maxW="container.xl" pt={20} pb={10}>
      <VStack spacing={8}>
        <Box textAlign="center">
          <Heading>จัดการระบบ</Heading>
          <Text mt={2} color="gray.600">
            จัดการสินค้าและผู้ใช้งานในระบบ
          </Text>
        </Box>

        <Box w="100%" bg="white" p={8} borderRadius="lg" boxShadow="lg">
          <Tabs isFitted variant="enclosed">
            <TabList mb="1em">
              <Tab>จัดการสินค้า</Tab>
              <Tab>จัดการผู้ใช้</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <VStack spacing={4} align="stretch">
                  <Button
                    leftIcon={<AddIcon />}
                    colorScheme="blue"
                    onClick={() => {
                      setSelectedProduct(null);
                      onOpen();
                    }}
                  >
                    เพิ่มสินค้าใหม่
                  </Button>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>ชื่อสินค้า</Th>
                        <Th>ราคา</Th>
                        <Th>คงเหลือ</Th>
                        <Th>หมวดหมู่</Th>
                        <Th>จัดการ</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {products.map((product) => (
                        <Tr key={product._id}>
                          <Td>{product.name}</Td>
                          <Td>฿{product.price}</Td>
                          <Td>{product.stock}</Td>
                          <Td>{product.category}</Td>
                          <Td>
                            <HStack spacing={2}>
                              <IconButton
                                icon={<EditIcon />}
                                onClick={() => {
                                  setSelectedProduct(product);
                                  onOpen();
                                }}
                              />
                              <IconButton
                                icon={<DeleteIcon />}
                                colorScheme="red"
                                onClick={() => handleDelete(product._id)}
                              />
                            </HStack>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </VStack>
              </TabPanel>
              <TabPanel>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>ชื่อผู้ใช้</Th>
                      <Th>อีเมล</Th>
                      <Th>ยอดเงินคงเหลือ</Th>
                      <Th>สถานะ</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {users.map((user) => (
                      <Tr key={user._id}>
                        <Td>{user.username}</Td>
                        <Td>{user.email}</Td>
                        <Td>฿{user.balance}</Td>
                        <Td>{user.role}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </VStack>
      <ProductModal />
    </Container>
  );
};

export default Admin; 