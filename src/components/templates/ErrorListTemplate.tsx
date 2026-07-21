import type { ErrorListProps } from '@rjsf/utils'
import {
  Box,
  List,
  Text,
} from '@chakra-ui/react'

const styles = {
  container: {
    mb: 4,
    p: 3,
    borderWidth: '1px',
    borderColor: 'red.300',
    bg: 'red.50',
    borderRadius: 'md',
    _dark: { borderColor: 'red.700', bg: 'red.950' },
  },
  heading: {
    fontSize: 'sm',
    fontWeight: 'bold',
    color: 'red.700',
    _dark: { color: 'red.200' },
    mb: 1,
  },
  listItem: {
    color: 'red.700',
    _dark: { color: 'red.200' },
    fontSize: 'sm',
  },
} as const

export default function ErrorListTemplate(props: ErrorListProps) {
  if (!props.errors?.length) {
    return null
  }

  return (
    <Box className='eg-error-list-template' {...styles.container}>
      <Text {...styles.heading}>
        Please fix the following errors:
      </Text>
      <List.Root gap={1}>
        {props.errors.map((error, index) => (
          <List.Item key={`${error.stack}-${index}`} {...styles.listItem}>
            {error.stack}
          </List.Item>
        ))}
      </List.Root>
    </Box>
  )
}
