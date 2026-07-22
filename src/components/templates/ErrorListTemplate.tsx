import type { ErrorListProps } from '@rjsf/utils'
import { List } from '@chakra-ui/react'
import { errorListRecipe, ErrorListContainer, ErrorListHeading } from '../../ui/recipes/error-list'
import { useRecipeStyles } from '../../ui/use-recipe-styles'

export default function ErrorListTemplate(props: ErrorListProps) {
  const recipe = useRecipeStyles('errorList', errorListRecipe)

  if (!props.errors?.length) {
    return null
  }

  const styles = recipe()

  return (
    <ErrorListContainer className='eg-error-list-template'>
      <ErrorListHeading>
        Please fix the following errors:
      </ErrorListHeading>
      <List.Root gap={1}>
        {props.errors.map((error, index) => (
          <List.Item key={`${error.stack}-${index}`} css={styles.listItem}>
            {error.stack}
          </List.Item>
        ))}
      </List.Root>
    </ErrorListContainer>
  )
}
