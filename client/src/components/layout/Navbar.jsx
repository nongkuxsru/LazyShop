import React from 'react';
import {
  Box,
  Flex,
  Button,
  useColorModeValue,
  Stack,
  useColorMode,
  Container,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
} from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const navigate = useNavigate();
  
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4} position="fixed" w="100%" zIndex={999}>
      <Container maxW="container.xl">
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <Link to="/">
            <Text fontSize="xl" fontWeight="bold">
              LazyShop
            </Text>
          </Link>

          <Flex alignItems={'center'}>
            <Stack direction={'row'} spacing={7}>
              <Button onClick={toggleColorMode}>
                {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
              </Button>

              {user ? (
                <Menu>
                  <MenuButton
                    as={Button}
                    rounded={'full'}
                    variant={'link'}
                    cursor={'pointer'}
                    minW={0}>
                    <Avatar
                      size={'sm'}
                      name={user.username}
                    />
                  </MenuButton>
                  <MenuList>
                    <MenuItem as={Link} to="/profile">
                      โปรไฟล์
                    </MenuItem>
                    <MenuItem as={Link} to="/topup">
                      เติมเงิน (฿{user.balance})
                    </MenuItem>
                    <MenuItem as={Link} to="/history">
                      ประวัติการสั่งซื้อ
                    </MenuItem>
                    {user.role === 'admin' && (
                      <MenuItem as={Link} to="/admin">
                        จัดการระบบ
                      </MenuItem>
                    )}
                    <MenuItem onClick={handleLogout}>
                      ออกจากระบบ
                    </MenuItem>
                  </MenuList>
                </Menu>
              ) : (
                <Stack direction={'row'} spacing={4}>
                  <Button
                    as={Link}
                    to="/login"
                    colorScheme="blue"
                    variant="solid">
                    เข้าสู่ระบบ
                  </Button>
                  <Button
                    as={Link}
                    to="/register"
                    colorScheme="blue"
                    variant="outline">
                    สมัครสมาชิก
                  </Button>
                </Stack>
              )}
            </Stack>
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
};

export default Navbar; 