import type { WidgetProps } from '@rjsf/utils'
import {
  Box,
  Field,
  Flex,
  Text,
} from '@chakra-ui/react'

/**
 * Purely presentational widget: renders a horizontal rule with the word "or"
 * centered to visually separate two sections of a form. Holds no value.
 */
export default function OrFieldWidget(props: WidgetProps) {
  const label = props.uiSchema?.['ui:options']?.label
  const text = typeof label === 'string' ? label : 'or'

  return (
    <Field.Root className='eg-or-field-widget'>
      <Flex
        w="full"
        alignItems="center"
        gap={3}
        my={4}
      >
        <Box
          flex="1"
          h="1px"
          bg="#e9ecef"
          _dark={{ bg: 'gray.600' }}
        />
        <Text
          fontSize="sm"
          fontWeight="600"
          textTransform="uppercase"
          color="gray.500"
          _dark={{ color: 'gray.400' }}
        >
          {text}
        </Text>
        <Box
          flex="1"
          h="1px"
          bg="#e9ecef"
          _dark={{ bg: 'gray.600' }}
        />
      </Flex>
    </Field.Root>
  )
}
