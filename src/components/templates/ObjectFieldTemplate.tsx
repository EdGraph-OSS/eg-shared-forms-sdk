import type { ObjectFieldTemplateProps } from '@rjsf/utils'
import {
  Box,
  Flex,
  Heading,
  Stack,
  Text,
} from '@chakra-ui/react'
import HtmlFieldWidget from '../widgets/HtmlFieldWidget'
import ImageFieldWidget from '../widgets/ImageFieldWidget'
import { colors } from '../../ui'

const styles = {
  rootTitle: {
    fontSize: '2xl',
    fontWeight: 'bold',
    color: '#1A365D',
    _dark: { color: 'gray.100' },
    mb: 4,
    mt: 0,
  },
  rootDescription: {
    fontSize: 'sm',
    lineHeight: '1.6',
    mb: 4,
    color: 'gray.600',
    _dark: { color: 'gray.300' },
  },
  customFieldContainer: {
    gap: 1,
    align: 'center',
    justify: 'space-between',
    flexWrap: 'wrap',
    borderBottom: '1px solid',
    borderColor: 'gray.200',
    _dark: { borderColor: 'gray.600' },
    py: 3,
  },
  customFieldDescription: {
    fontSize: 'sm',
    fontWeight: 'normal',
    color: 'gray.500',
    _dark: { color: 'gray.300' },
  },
  sectionContainer: {
    mb: 8,
    borderRadius: 'sm',
    overflow: 'hidden',
    borderWidth: '1px',
    borderColor: 'primary',
    _dark: { borderColor: 'gray.600' },
  },
  sectionHeader: {
    bg: colors.primary.light,
    _dark: { bg: colors.primary.dark },
    color: 'white',
    px: 2,
    py: 2,
    align: 'center',
    justify: 'space-between',
    flexWrap: 'wrap',
  },
  sectionDescription: {
    fontSize: 'sm',
    color: 'whiteAlpha.900',
    fontWeight: 'normal',
  },
  sectionSubHeading: {
    color: 'white',
    background: colors.primary.dark,
    _dark: { color: 'gray.100', background: 'gray.700' },
    px: 2,
    py: 1,
    fontSize: 'sm',
  },
  sectionProperties: {
    bg: 'white',
    _dark: { bg: 'gray.800' },
    px: 4,
    py: 2,
    minH: '100px',
  },
} as const

export default function ObjectFieldTemplate(props: ObjectFieldTemplateProps) {
  const { title, description, properties, registry, uiSchema } = props

  const isRoot = props.schema === registry?.rootSchema
  const subHeading = uiSchema?.['ui:subHeading'] as string | undefined
  const showHeading = title && title.trim() !== ''
  const formImage = uiSchema?.['ui:image'] as string | undefined

  if (isRoot) {
    return (
      <Stack className="eg-form-root" gap={0} mb={0} alignItems="start" width="full">
        {formImage && (
          <img src={formImage} className="max-h-32 max-w-full mb-2" alt="Form Image" />
        )}
        {title && (
          <Heading
            className='eg-form-root-title'
            as="h1"
            {...styles.rootTitle}
            dangerouslySetInnerHTML={{ __html: String(title) }}
          />
        )}
        {description && (
          typeof description === 'string'
            ? (
              <Text {...styles.rootDescription} className="eg-form-root-description HtmlContent" dangerouslySetInnerHTML={{ __html: String(description) }}></Text>
            )
            : description
        )}
        {properties.map(element => (
          <Box key={element.name} className="eg-form-root-property property-wrapper w-full" mb={0}>
            {element.content}
          </Box>
        ))}
      </Stack>
    )
  }

  if (props.uiSchema?.['ui:field'] === 'SectionPicker') {
    return 'SectionPicker'
  }

  if (props.uiSchema?.['ui:widget'] && ['CurrentUserName', 'SectionPicker'].includes(props.uiSchema?.['ui:widget'].toString())) {
    return (
      <Flex
        className='eg-object-field-template-custom'
        {...styles.customFieldContainer}>
        <Box flex={1}>
          {showHeading && (
            <Heading className='eg-object-field-template-heading' as="h2" size="lg" fontWeight="bold" dangerouslySetInnerHTML={{ __html: String(title) }} />
          )}

          {description && (
            typeof description === 'string'
              ? (
                <Text
                  {...styles.customFieldDescription}
                  className="eg-object-field-template-description HtmlContent text-gray-400"
                  dangerouslySetInnerHTML={{ __html: String(description) }}
                />
              )
              : description
          )}
        </Box>
        {properties.map(element => (
          <div key={element.name} className="eg-object-field-template-content property-wrapper rjsf-property-enter">
            {element.content}
          </div>
        ))}
      </Flex>
    )
  }

  type DecorativeField = { widget: 'HtmlWidget' | 'ImageWidget', content: string, alt?: string, title?: string }
  const fullOrder = uiSchema?.['ui:fullOrder'] as string[] | undefined
  const decorativeFields = uiSchema?.['ui:decorativeFields'] as Record<string, DecorativeField> | undefined
  const propertyMap = Object.fromEntries(properties.map(p => [p.name, p.content]))
  const orderedKeys = fullOrder ?? properties.map(p => p.name)

  return (
    <Box className="eg-section-domain w-full" {...styles.sectionContainer}>
      <Flex {...styles.sectionHeader}>
        <Box flex="1" minW={0}>
          {showHeading && (
            <Heading
              className='eg-section-domain-heading' as="h2" size="lg" fontWeight="bold"
              color="white"
              dangerouslySetInnerHTML={{ __html: String(title) }}
            />
          )}
          {description && (
            typeof description === 'string'
              ? (
                <Text
                  {...styles.sectionDescription}
                  className="eg-section-domain-description HtmlContent"
                  dangerouslySetInnerHTML={{ __html: String(description) }}
                />
              )
              : description
          )}
        </Box>
      </Flex>
      {subHeading && (
        <Box
          className="eg-section-domain-subheading HtmlContent"
          {...styles.sectionSubHeading}
          dangerouslySetInnerHTML={{ __html: String(subHeading) }}
        />
      )}
      <Box className='eg-section-domain-properties' {...styles.sectionProperties}>
        <Stack gap={0} className="eg-section-domain-properties rjsf-section-properties">
          {orderedKeys.map((key) => {
            if (propertyMap[key]) {
              return (
                <Box key={key} className="eg-section-domain-property property-wrapper rjsf-property-enter">
                  {propertyMap[key]}
                </Box>
              )
            }
            const decorative = decorativeFields?.[key]
            if (decorative) {
              return (
                <Box key={key} className="eg-section-domain-property eg-decorative-field property-wrapper">
                  {decorative.widget === 'HtmlWidget' && (
                    <HtmlFieldWidget id={key} value={decorative.content} schema={{ default: decorative.content }} {...({} as any)} />
                  )}
                  {decorative.widget === 'ImageWidget' && (
                    <ImageFieldWidget id={key} value={decorative.content} schema={{ default: decorative.content, description: decorative.alt, title: decorative.title }} {...({} as any)} />
                  )}
                </Box>
              )
            }
            return null
          })}
        </Stack>
      </Box>
    </Box>
  )
}
