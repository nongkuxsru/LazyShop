import React, { useState, useEffect } from 'react';
import {
  Container,
  SimpleGrid,
  Box,
  Image,
  Text,
  Button,
  VStack,
  Heading,
  useToast,
  Flex,
  Badge,
  Stat,
  StatLabel,
  StatNumber,
  Link,
} from '@chakra-ui/react';
import axios from 'axios';
import { Link as RouterLink } from 'react-router-dom';

const StatCard = ({ label, value }) => (
  <Box bg="blackAlpha.800" p={4} borderRadius="lg" color="white">
    <Stat>
      <StatLabel fontSize="lg">{label}</StatLabel>
      <StatNumber fontSize="4xl">{value}</StatNumber>
    </Stat>
  </Box>
);

const MenuCard = ({ title, image, link }) => (
  <Link as={RouterLink} to={link} _hover={{ textDecoration: 'none' }}>
    <Box
      bg="blue.900"
      borderRadius="lg"
      overflow="hidden"
      transition="transform 0.2s"
      _hover={{ transform: 'scale(1.02)' }}
      position="relative"
      h="200px"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bgImage={`url(${image})`}
        bgSize="cover"
        bgPosition="center"
        opacity={0.8}
      />
      <Box
        position="absolute"
        top={0}
        right={0}
        px={3}
        py={1}
        bg="yellow.400"
        color="gray.800"
        borderBottomLeftRadius="lg"
        fontWeight="bold"
        fontSize="sm"
      >
        คลิกที่นี่
      </Box>
      <Box
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        p={4}
        bg="rgba(0, 0, 0, 0.7)"
        textAlign="center"
      >
        <Text color="white" fontSize="xl" fontWeight="bold">
          {title}
        </Text>
      </Box>
    </Box>
  </Link>
);

const ProductCard = ({ title, subtitle, image }) => (
  <Box
    bg="blackAlpha.800"
    borderRadius="lg"
    overflow="hidden"
    position="relative"
  >
    <Image src={image} alt={title} w="100%" h="200px" objectFit="cover" />
    <Box p={4}>
      <Heading size="md" color="white" mb={2}>
        {title}
      </Heading>
      <Text color="gray.300" fontSize="sm">
        {subtitle}
      </Text>
    </Box>
  </Box>
);

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/products');
      setProducts(res.data);
    } catch (err) {
      toast({
        title: 'เกิดข้อผิดพลาด',
        description: 'ไม่สามารถโหลดรายการสินค้าได้',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (productId) => {
    if (!user) {
      toast({
        title: 'กรุณาเข้าสู่ระบบ',
        description: 'คุณต้องเข้าสู่ระบบก่อนทำการสั่งซื้อ',
        status: 'warning',
        duration: 3000,
      });
      return;
    }

    try {
      await axios.post(
        'http://localhost:5001/api/transactions/purchase',
        {
          products: [{ product: productId, quantity: 1 }],
        },
        {
          headers: {
            'x-auth-token': localStorage.getItem('token'),
          },
        }
      );

      toast({
        title: 'สั่งซื้อสำเร็จ',
        status: 'success',
        duration: 3000,
      });

      fetchProducts(); // Refresh products
    } catch (err) {
      toast({
        title: 'เกิดข้อผิดพลาด',
        description: err.response?.data?.message || 'ไม่สามารถทำการสั่งซื้อได้',
        status: 'error',
        duration: 3000,
      });
    }
  };

  return (
    <Box
      bgImage="url('/images/background.jpg')"
      bgSize="cover"
      bgPosition="center"
      minH="calc(100vh - 64px)"
    >
      <Container maxW="container.xl" py={8}>
        {/* Stats Section */}
        <SimpleGrid columns={3} spacing={4} mb={8}>
          <StatCard label="ผู้ใช้งาน" value="401 คน" />
          <StatCard label="สินค้า" value="626 ชิ้น" />
          <StatCard label="ยอดขาย" value="695 บาท" />
        </SimpleGrid>

        {/* Menu Cards */}
        <SimpleGrid columns={4} spacing={4} mb={8}>
          <MenuCard
            title="สอนใช้ WEB"
            image="/images/icons/tutorial.png"
            link="/tutorial"
          />
          <MenuCard
            title="ติดต่อ CONTACT"
            image="/images/icons/contact.png"
            link="/contact"
          />
          <MenuCard
            title="เติมเงิน TOP UP"
            image="/images/icons/topup.png"
            link="/topup"
          />
          <MenuCard
            title="สินค้า PRODUCT"
            image="/images/icons/product.png"
            link="/products"
          />
        </SimpleGrid>

        {/* Product Cards */}
        <SimpleGrid columns={2} spacing={4}>
          <ProductCard
            title="รวม ID ทอง"
            subtitle="อ้างอิงราคาเมื่อวันที่ครบกำหนดเว็บเซ็นเซอร์ได้"
            image="/images/products/gold-id.jpg"
          />
          <ProductCard
            title="รวม ID M ล้วน"
            subtitle="รวม ID M ล้วน"
            image="/images/products/m-id.jpg"
          />
        </SimpleGrid>

        {/* Footer */}
        <Box mt={16} textAlign="center" color="white">
          <Image
            src="/images/logo.png"
            alt="Lazy Shop Logo"
            h="100px"
            mx="auto"
            mb={4}
          />
          <Text fontSize="lg" fontWeight="bold">
            Lazy Shop
          </Text>
          <Text>
            Lazy Shop จำหน่าย ID FCOnline M ส่วน ID ทอง
          </Text>
          <Text fontSize="sm" mt={4}>
            © 2024 Lazy Shop. All right reserved.
          </Text>
          <Text fontSize="sm">
            Reazy Studio{' '}
            <Link href="#" color="blue.400">
              ติดต่อเจ้าของเว็บไซต์
            </Link>{' '}
            /{' '}
            <Link href="#" color="blue.400">
              แจ้งปัญหาร้านค้า
            </Link>
          </Text>
        </Box>
      </Container>
    </Box>
  );
};

export default Home; 