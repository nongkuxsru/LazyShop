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

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
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

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: 'รหัสผ่านไม่ตรงกัน',
        description: 'กรุณากรอกรหัสผ่านให้ตรงกันทั้งสองช่อง',
        status: 'error',
        duration: 2000,
      });
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: 'รหัสผ่านไม่ถูกต้อง',
        description: 'รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร',
        status: 'error',
        duration: 2000,
      });
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post('http://localhost:5001/api/auth/register', {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
      
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        
        toast({
          title: 'สมัครสมาชิกสำเร็จ',
          description: `ยินดีต้อนรับ ${res.data.user.username}`,
          status: 'success',
          duration: 2000,
        });
        
        navigate('/');
      }
    } catch (err) {
      let errorMessage = 'เกิดข้อผิดพลาดในการสมัครสมาชิก';
      
      if (err.response?.data?.message) {
        if (err.response.data.message.includes('duplicate')) {
          if (err.response.data.message.includes('username')) {
            errorMessage = 'ชื่อผู้ใช้นี้ถูกใช้งานแล้ว';
          } else if (err.response.data.message.includes('email')) {
            errorMessage = 'อีเมลนี้ถูกใช้งานแล้ว';
          }
        } else {
          errorMessage = err.response.data.message;
        }
      }
      
      toast({
        title: 'เกิดข้อผิดพลาด',
        description: errorMessage,
        status: 'error',
        duration: 2000,
      });
    }

    setLoading(false);
  };

  return (
    <Container maxW="container.sm" py={10}>
      <VStack spacing={8}>
        <Heading>สมัครสมาชิก</Heading>
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
                <FormLabel>อีเมล</FormLabel>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="กรอกอีเมล"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>รหัสผ่าน</FormLabel>
                <Input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="กรอกรหัสผ่าน (อย่างน้อย 6 ตัวอักษร)"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>ยืนยันรหัสผ่าน</FormLabel>
                <Input
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="กรอกรหัสผ่านอีกครั้ง"
                />
              </FormControl>
              <Button
                type="submit"
                colorScheme="blue"
                w="100%"
                isLoading={loading}
              >
                สมัครสมาชิก
              </Button>
            </VStack>
          </form>
        </Box>
        <Text>
          มีบัญชีอยู่แล้ว?{' '}
          <Button
            variant="link"
            color="blue.500"
            onClick={() => navigate('/login')}
          >
            เข้าสู่ระบบ
          </Button>
        </Text>
      </VStack>
    </Container>
  );
};

export default Register; 