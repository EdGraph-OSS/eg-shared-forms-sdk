import type { WidgetProps } from '@rjsf/utils'
import type { SystemStyleObject } from '@chakra-ui/react'
import {
  Box,
  Field,
  Flex,
  Text,
} from '@chakra-ui/react'

/** Sensible amber "notice" look used when the uiSchema provides no `styles`. */
const DEFAULT_STYLES: SystemStyleObject = {
  bg: '#fff3cd',
  borderLeft: '4px solid #ffc107',
  borderRadius: '4px',
  padding: '16px',
}

/**
 * Purely presentational widget: renders a styled callout/notice from uiSchema
 * config. Holds no value and is excluded from formData.
 *
 * All config is read from `ui:options` (RJSF's channel for custom widget
 * options), surfaced here as `props.options`:
 *   'ui:widget': 'InfoMessageWidget'
 *   'ui:options':
 *     styles: Chakra SystemStyleObject applied to the container (bg, border, padding, …)
 *     preText:      bold lead-in text (e.g. "🔒 Your privacy matters: ")
 *     text:         body text following the lead-in
 *     body:         optional paragraph rendered below the preText/text line and above the list
 *     list:         optional array of strings rendered as a bulleted list
 */
export default function InfoMessageWidget(props: WidgetProps) {
  const options = (props.options ?? {}) as Record<string, unknown>
  const styles = (options.styles as SystemStyleObject | undefined) ?? DEFAULT_STYLES
  const preText = typeof options.preText === 'string' ? options.preText : ''
  const text = typeof options.text === 'string' ? options.text : ''
  const body = typeof options.body === 'string' ? options.body : ''
  const list = Array.isArray(options.list)
    ? (options.list as unknown[]).filter((s): s is string => typeof s === 'string')
    : []

  if (!preText && !text && !body && list.length === 0) {
    return null
  }

  return (
    <Field.Root className='eg-info-message-widget'>
      <Box
        w="full"
        my={2}
        css={{
          color: '#333',
          fontSize: '0.9375rem',
          lineHeight: 1.6,
          ...styles,
        }}>
        <Flex flexDir='row'>
          <Text>
            { preText && <Text as="span" fontWeight='700'>{preText}</Text> }
            { text && <Text as="span" ml='6px'>{text}</Text> }
          </Text>
        </Flex>
        {body && (
          <Text mt={preText || text ? '8px' : 0}>{body}</Text>
        )}
        {list.length > 0 && (
          <Box as="ul" pl="20px" mt={preText || text || body ? '8px' : 0}>
            {list.map((item, i) => (
              <Text as="li" key={i}>{item}</Text>
            ))}
          </Box>
        )}
      </Box>
    </Field.Root>
  )
}
