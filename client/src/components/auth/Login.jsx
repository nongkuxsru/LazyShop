import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
  useToast,
  Container,
  Heading,
} from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5001/api/auth/login', formData);
      
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        
        toast({
          title: 'เข้าสู่ระบบสำเร็จ',
          description: `ยินดีต้อนรับ ${res.data.user.username}`,
          status: 'success',
          duration: 2000,
        });
        
        navigate('/');
      }
    } catch (err) {
      toast({
        title: 'เกิดข้อผิดพลาด',
        description: err.response?.data?.message || 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง',
        status: 'error',
        duration: 2000,
      });
    }

    setLoading(false);
  };

  return (
    <Container maxW="container.sm" py={10}>
      <VStack spacing={8}>
        <Heading>เข้าสู่ระบบ</Heading>
        <Box w="100%" bg="white" p={8} borderRadius="lg" boxShadow="lg">
          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>ชื่อผู้ใช้</FormLabel>
                <Input
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="กรอกชื่อผู้ใช้"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>รหัสผ่าน</FormLabel>
                <Input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="กรอกรหัสผ่าน"
                />
              </FormControl>
              <Button
                type="submit"
                colorScheme="blue"
                w="100%"
                isLoading={loading}
              >
                เข้าสู่ระบบ
              </Button>
            </VStack>
          </form>
        </Box>
        <Text>
          ยังไม่มีบัญชี?{' '}
          <Button
            variant="link"
            color="blue.500"
            onClick={() => navigate('/register')}
          >
            สมัครสมาชิก
          </Button>
        </Text>
      </VStack>
    </Container>
  );
};

export default Login; 