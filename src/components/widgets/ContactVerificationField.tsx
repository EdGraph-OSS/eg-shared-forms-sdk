import type { FieldProps } from '@rjsf/utils'
import type { SystemStyleObject } from '@chakra-ui/react'
import type { ChangeEvent } from 'react'
import {
  Box,
  Button,
  Field,
  Flex,
  Input,
  Text,
} from '@chakra-ui/react'
import { contactVerificationRecipe } from '../../ui/recipes/contact-verification'
import { textFieldRecipe } from '../../ui/recipes/text-field'
import { fieldHeaderRecipe } from '../../ui/recipes/field-header'
import { useRecipeStyles, useSingleRecipeStyles } from '../../ui/use-recipe-styles'

type ContactVerificationValue = {
  email?: string
  phone?: string
}

/**
 * Per-user contact-on-file values, supplied via RJSF's `formContext` (not `ui:options`) because
 * they vary per form render/accessing user rather than being part of the static form definition.
 * Read from `props.registry.formContext` — `FieldProps` has no top-level `formContext`.
 * See `formContext={{ maskedEmail, maskedPhone }}` in App.tsx.
 */
type ContactVerificationFormContext = {
  maskedEmail?: string
  maskedPhone?: string
  onExecuteAction?: (action: string) => void
}

/**
 * Composite email-or-phone verification card: a bordered/colored card (optional icon + title)
 * wrapping a masked-value prompt + email input, an "or" separator, and a masked-value prompt +
 * phone input. Registered as a custom RJSF *field* (not a widget) because the stored value is an
 * object `{ email?, phone? }` — two independent sub-values rather than a single leaf — mirroring
 * how RadioCardsField/CheckboxCardsField own an object sub-schema.
 *
 * Static copy is read from `ui:options` on the field's uiSchema:
 *   'ui:field': 'ContactVerificationField'
 *   'ui:options':
 *     title:             card heading (e.g. "Complete your previous contact information on file:")
 *     icon:               optional emoji/text shown before the title
 *     maskedEmailLabel:   bold prompt shown above the email input (e.g. "Complete the email address we have on file:")
 *     maskedPhoneLabel:   bold prompt shown above the phone input (e.g. "Complete the phone number we have on file:")
 *     orLabel:            separator text between the two inputs (defaults to "or")
 *     customStyles:       Chakra SystemStyleObject applied to the card container
 *
 * The actual masked email/phone on file are per-user, not part of the form definition, so they
 * come from RJSF's `formContext` instead: `formContext={{ maskedEmail, maskedPhone }}`. They are
 * appended after the corresponding `ui:options` label.
 */
export default function ContactVerificationField(props: FieldProps) {
  const options = (props.uiSchema?.['ui:options'] ?? {}) as Record<string, unknown>
  const recipeStyles = useRecipeStyles('contactVerification', contactVerificationRecipe)()
  const styles = { ...recipeStyles.container, ...(options.customStyles as SystemStyleObject | undefined ?? {}) }
  const title = (typeof options.title === 'string' && options.title)
    || (typeof props.schema?.title === 'string' ? props.schema.title : '')
  const icon = typeof options.icon === 'string' ? options.icon : ''
  const orLabel = typeof options.orLabel === 'string' ? options.orLabel : 'or'

  const formContext = (props.registry.formContext ?? {}) as ContactVerificationFormContext
  const onExecuteAction = formContext.onExecuteAction

  console.log("form context", formContext)

  const retryAction = typeof options.retryAction === 'string' ? options.retryAction : 'contact-verification:retry'
  const hasMaskedEmail = !!formContext.maskedEmail?.trim()
  const hasMaskedPhone = !!formContext.maskedPhone?.trim()
  const maskedEmailLabel = [
    typeof options.maskedEmailLabel === 'string' ? options.maskedEmailLabel : '',
    typeof formContext.maskedEmail === 'string' ? formContext.maskedEmail : '',
  ].filter(Boolean).join(' ')
  const maskedPhoneLabel = [
    typeof options.maskedPhoneLabel === 'string' ? options.maskedPhoneLabel : '',
    typeof formContext.maskedPhone === 'string' ? formContext.maskedPhone : '',
  ].filter(Boolean).join(' ')

  const isDisabled = props.disabled || props.readonly

  /** RJSF must stay controlled from `formData`; the sub-values are never read from a defaultValue. */
  const value: ContactVerificationValue = (props.formData && typeof props.formData === 'object')
    ? props.formData as ContactVerificationValue
    : {}

  const errorSchema = (props.errorSchema ?? {}) as Record<string, { __errors?: string[] } | undefined>
  const emailHasError = !!errorSchema.email?.__errors?.length
  const phoneHasError = !!errorSchema.phone?.__errors?.length

  function update(next: ContactVerificationValue) {
    props.onChange(next, props.fieldPathId.path)
  }

  function onEmailChange(e: ChangeEvent<HTMLInputElement>) {
    const next = e.target.value
    update({ ...value, email: next === '' ? undefined : next })
  }

  function onPhoneChange(e: ChangeEvent<HTMLInputElement>) {
    const next = e.target.value
    update({ ...value, phone: next === '' ? undefined : next })
  }

  const emailFieldStyles = useSingleRecipeStyles('textField', textFieldRecipe)({ invalid: emailHasError })
  const phoneFieldStyles = useSingleRecipeStyles('textField', textFieldRecipe)({ invalid: phoneHasError })
  const headerStyles = useSingleRecipeStyles('fieldHeader', fieldHeaderRecipe)()

  return (
    <Field.Root className="eg-contact-verification-field" readOnly={props.readonly}>
      <Box
        w="full"
        my={2}
        css={styles}
      >
        {title && (
          <Flex align="center" gap={2} mb={4}>
            {icon && (
              <Text as="span" fontSize="1.25rem" lineHeight={1}>
                {icon}
              </Text>
            )}
            <Text as="h3" css={recipeStyles.title}>
              {title}
            </Text>
          </Flex>
        )}

        {hasMaskedEmail && (
          <Flex flexDir="column" w="full">
            {maskedEmailLabel && (
              <Text css={headerStyles} mb={1}>
                {maskedEmailLabel}
              </Text>
            )}
            <Input
              type="email"
              value={value.email ?? ''}
              onChange={onEmailChange}
              placeholder="Enter the complete email address"
              disabled={isDisabled}
              minW="390px"
              h="54px"
              padding="8px"
              css={emailFieldStyles}
            />
          </Flex>
        )}

        {hasMaskedEmail && hasMaskedPhone && (
          <Flex w="full" alignItems="center" gap={3} my={4}>
            <Box flex="1" h="1px" bg="#e9ecef" _dark={{ bg: 'gray.600' }} />
            <Text
              fontSize="sm"
              fontWeight="600"
              textTransform="uppercase"
              color="gray.500"
              _dark={{ color: 'gray.400' }}
            >
              {orLabel}
            </Text>
            <Box flex="1" h="1px" bg="#e9ecef" _dark={{ bg: 'gray.600' }} />
          </Flex>
        )}

        {hasMaskedPhone && (
          <Flex flexDir="column" w="full">
            {maskedPhoneLabel && (
              <Text css={headerStyles} mb={1}>
                {maskedPhoneLabel}
              </Text>
            )}
            <Input
              type="tel"
              inputMode="tel"
              value={value.phone ?? ''}
              onChange={onPhoneChange}
              placeholder="Enter the complete phone number"
              disabled={isDisabled}
              minW="390px"
              h="54px"
              padding="8px"
              css={phoneFieldStyles}
            />
          </Flex>
        )}
      </Box>

      {onExecuteAction && (
        <Button
          mt={2}
          size="sm"
          variant="outline"
          onClick={() => onExecuteAction(retryAction)}
        >
          Try Again
        </Button>
      )}
    </Field.Root>
  )
}
