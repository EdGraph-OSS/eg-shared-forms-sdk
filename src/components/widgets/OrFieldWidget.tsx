import type { WidgetProps } from '@rjsf/utils'
import {
  Box,
  Field,
  Flex,
  Text,
} from '@chakra-ui/react'
import { dividerFieldRecipe } from '../../ui/recipes/divider-field'
import { useRecipeStyles } from '../../ui/use-recipe-styles'

/**
 * Purely presentational widget: renders a horizontal rule with the word "or"
 * centered to visually separate two sections of a form. Holds no value.
 */
export default function OrFieldWidget(props: WidgetProps) {
  const label = props.uiSchema?.['ui:options']?.label
  const text = typeof label === 'string' ? label : 'or'

  const styles = useRecipeStyles('dividerField', dividerFieldRecipe)()

  return (
    <Field.Root className='eg-or-field-widget'>
      <Flex
        w="full"
        alignItems="center"
        gap={3}
        my={4}
      >
        <Box flex="1" h="1px" css={styles.line} />
        <Text css={styles.label}>
          {text}
        </Text>
        <Box flex="1" h="1px" css={styles.line} />
      </Flex>
    </Field.Root>
  )
}
