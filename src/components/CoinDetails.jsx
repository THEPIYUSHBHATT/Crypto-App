import {
  Badge,
  Box,
  Button,
  Container,
  HStack,
  Image,
  Progress,
  Radio,
  RadioGroup,
  Stat,
  StatArrow,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
  VStack,
} from '@chakra-ui/react'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Loader from './Loader'
import { server } from '../main'
import ErrorComponent from './ErrorComponent'

function CoinDetails() {
  const [coins, setCoins] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [currency, setCurrency] = useState('inr')

  const currencySymbol =
    currency === 'inr' ? '₹' : currency === 'eur' ? '€' : '$'

  const params = useParams()

  useEffect(() => {
    const fetchCoin = async () => {
      try {
        const { data } = await axios.get(`${server}/coins/${params.id}`)

        setCoins(data)
        setLoading(false)
      } catch (error) {
        setError(true)
        setLoading(false)
      }
    }
    fetchCoin()
  }, [params.id])

  if (error) return <ErrorComponent message={'Error While Fetching Coin'} />

  return (
    <>
      <Container maxW={'container.xl'}>
        {loading ? (
          <Loader />
        ) : (
          <>
            <Box width={'full'}></Box>

            <RadioGroup value={currency} onChange={setCurrency} p={'8'}>
              <HStack spacing={'4'}>
                <Radio value={'inr'}>INR</Radio>
                <Radio value={'usd'}>USD</Radio>
                <Radio value={'eur'}>EUR</Radio>
              </HStack>
            </RadioGroup>
            <VStack spacing={'4'} p={'16'} alignItems={'center'}>
              <Text fontSize={'small'} alignSelf={'center'} opacity={'0.7'}>
                Last updated on{' '}
                {Date(coins.market_data.last_updated).split('G')[0]}
              </Text>
              <Image
                src={coins.image.large}
                h={'16'}
                w={'16'}
                objectFit={'contain'}
              />
              <Stat>
                <StatLabel>{coins.name}</StatLabel>
                <StatNumber>
                  {currencySymbol}
                  {coins.market_data.current_price[currency]}
                </StatNumber>
                <StatHelpText>
                  <StatArrow
                    type={
                      coins.market_data.price_change_percentage_24h > 0
                        ? 'increase'
                        : 'decrease'
                    }
                  />
                  {coins.market_data.price_change_percentage_24h}%
                </StatHelpText>
              </Stat>
            </VStack>
          </>
        )}
      </Container>
    </>
  )
}
export default CoinDetails
