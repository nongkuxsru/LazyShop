import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  useToast,
  Container,
  Heading,
  Text,
  Avatar,
  Center,
  Divider,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData) {
      navigate('/login');
      return;
    }
    setUser(userData);
    setFormData(prev => ({
      ...prev,
      username: userData.username,
      email: userData.email,
    }));
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // ตรวจสอบรหัสผ่านใหม่
    if (formData.newPassword) {
      if (formData.newPassword !== formData.confirmNewPassword) {
        toast({
          title: 'รหัสผ่านไม่ตรงกัน',
          description: 'กรุณากรอกรหัสผ่านใหม่ให้ตรงกันทั้งสองช่อง',
          status: 'error',
          duration: 2000,
        });
        setLoading(false);
        return;
      }

      if (formData.newPassword.length < 6) {
        toast({
          title: 'รหัสผ่านไม่ถูกต้อง',
          description: 'รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร',
          status: 'error',
          duration: 2000,
        });
        setLoading(false);
        return;
      }
    }

    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(
        'http://localhost:5001/api/users/profile',
        {
          username: formData.username,
          email: formData.email,
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // อัพเดทข้อมูลใน localStorage
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setUser(res.data.user);

      // รีเซ็ตฟอร์มรหัสผ่าน
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      }));

      toast({
        title: 'อัพเดทโปรไฟล์สำเร็จ',
        status: 'success',
        duration: 2000,
      });
    } catch (err) {
      toast({
        title: 'เกิดข้อผิดพลาด',
        description: err.response?.data?.message || 'ไม่สามารถอัพเดทโปรไฟล์ได้',
        status: 'error',
        duration: 2000,
      });
    }

    setLoading(false);
  };

  if (!user) {
    return null;
  }

  return (
    <Container maxW="container.sm" py={10}>
      <VStack spacing={8}>
        <Heading>โปรไฟล์</Heading>
        <Center>
          <Avatar
            size="2xl"
            name={user.username}
          />
        </Center>
        <Box w="100%" bg="white" p={8} borderRadius="lg" boxShadow="lg">
          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>ชื่อผู้ใช้</FormLabel>
                <Input
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="กรอกชื่อผู้ใช้"
                />
              </FormControl>
              <FormControl>
                <FormLabel>อีเมล</FormLabel>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="กรอกอีเมล"
                />
              </FormControl>
              
              <Divider my={4} />
              <Text w="100%" fontWeight="bold">เปลี่ยนรหัสผ่าน</Text>

              <FormControl>
                <FormLabel>รหัสผ่านปัจจุบัน</FormLabel>
                <InputGroup>
                  <Input
                    name="currentPassword"
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={formData.currentPassword}
                    onChange={handleChange}
                    placeholder="กรอกรหัสผ่านปัจจุบัน"
                  />
                  <InputRightElement width="4.5rem">
                    <Button
                      h="1.75rem"
                      size="sm"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? 'ซ่อน' : 'แสดง'}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              <FormControl>
                <FormLabel>รหัสผ่านใหม่</FormLabel>
                <InputGroup>
                  <Input
                    name="newPassword"
                    type={showNewPassword ? 'text' : 'password'}
                    value={formData.newPassword}
                    onChange={handleChange}
                    placeholder="กรอกรหัสผ่านใหม่"
                  />
                  <InputRightElement width="4.5rem">
                    <Button
                      h="1.75rem"
                      size="sm"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? 'ซ่อน' : 'แสดง'}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              <FormControl>
                <FormLabel>ยืนยันรหัสผ่านใหม่</FormLabel>
                <InputGroup>
                  <Input
                    name="confirmNewPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmNewPassword}
                    onChange={handleChange}
                    placeholder="กรอกรหัสผ่านใหม่อีกครั้ง"
                  />
                  <InputRightElement width="4.5rem">
                    <Button
                      h="1.75rem"
                      size="sm"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? 'ซ่อน' : 'แสดง'}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              <Button
                type="submit"
                colorScheme="blue"
                w="100%"
                mt={4}
                isLoading={loading}
              >
                บันทึกการเปลี่ยนแปลง
              </Button>
            </VStack>
          </form>
        </Box>
      </VStack>
    </Container>
  );
};

export default Profile; 