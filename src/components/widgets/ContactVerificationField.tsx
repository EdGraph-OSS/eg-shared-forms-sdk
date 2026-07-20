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

/** Pink "verification" card look used when the uiSchema provides no `customStyles`. */
const DEFAULT_STYLES: SystemStyleObject = {
  bg: '#fdeef0',
  border: '1px solid #e8a3ad',
  borderRadius: '12px',
  padding: '20px 24px',
}

const BASE_FIELD = {
  fontSize: '1rem',
  minW: '390px',
  borderRadius: '6px',
  bg: 'white',
  _dark: { bg: 'gray.800', color: 'gray.100', borderColor: 'gray.600' },
  outline: 'none',
} as const

function invalidBorder(hasError: boolean) {
  return {
    border: hasError ? '2px solid red' : '2px solid #e9ecef',
    _focus: { border: hasError ? '2px solid red' : '2px solid gray' },
  }
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
  const styles = (options.customStyles as SystemStyleObject | undefined) ?? DEFAULT_STYLES
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

  return (
    <Field.Root className="eg-contact-verification-field" readOnly={props.readonly}>
      <Box
        w="full"
        my={2}
        css={{
          color: '#333',
          _dark: { color: 'gray.100' },
          ...styles,
        }}
      >
        {title && (
          <Flex align="center" gap={2} mb={4}>
            {icon && (
              <Text as="span" fontSize="1.25rem" lineHeight={1}>
                {icon}
              </Text>
            )}
            <Text
              as="h3"
              fontWeight="700"
              fontSize="1.125rem"
              color="#1799a6"
              _dark={{ color: 'teal.200' }}
            >
              {title}
            </Text>
          </Flex>
        )}

        {hasMaskedEmail && (
          <Flex flexDir="column" w="full">
            {maskedEmailLabel && (
              <Text color="#333" _dark={{ color: 'gray.200' }} fontWeight="600" mb={1}>
                {maskedEmailLabel}
              </Text>
            )}
            <Input
              type="email"
              value={value.email ?? ''}
              onChange={onEmailChange}
              placeholder="Enter the complete email address"
              disabled={isDisabled}
              h="54px"
              padding="8px"
              {...BASE_FIELD}
              {...invalidBorder(emailHasError)}
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
              <Text color="#333" _dark={{ color: 'gray.200' }} fontWeight="600" mb={1}>
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
              h="54px"
              padding="8px"
              {...BASE_FIELD}
              {...invalidBorder(phoneHasError)}
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
