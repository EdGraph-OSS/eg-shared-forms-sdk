import type { ObjectFieldTemplateProps } from '@rjsf/utils'
import {
  Box,
  Heading,
  Stack,
} from '@chakra-ui/react'
import HtmlFieldWidget from '../widgets/HtmlFieldWidget'
import ImageFieldWidget from '../widgets/ImageFieldWidget'
import { SectionDomain } from '../../ui/recipes/section-domain'
import { TitleHeading } from '../../ui/recipes/title-heading'
import { FormDescription } from '../../ui/recipes/form-description'
import { ObjectFieldCustomContainer } from '../../ui/recipes/object-field-custom'

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
          <TitleHeading
            className='eg-form-root-title'
            variant="root"
            dangerouslySetInnerHTML={{ __html: String(title) }}
          />
        )}
        {description && (
          typeof description === 'string'
            ? (
              <FormDescription variant="root" className="eg-form-root-description HtmlContent" dangerouslySetInnerHTML={{ __html: String(description) }}></FormDescription>
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
      <ObjectFieldCustomContainer className='eg-object-field-template-custom'>
        <Box flex={1}>
          {showHeading && (
            <Heading className='eg-object-field-template-heading' as="h2" size="lg" fontWeight="bold" dangerouslySetInnerHTML={{ __html: String(title) }} />
          )}

          {description && (
            typeof description === 'string'
              ? (
                <FormDescription
                  variant="custom"
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
      </ObjectFieldCustomContainer>
    )
  }

  type DecorativeField = { widget: 'HtmlWidget' | 'ImageWidget', content: string, alt?: string, title?: string }
  const fullOrder = uiSchema?.['ui:fullOrder'] as string[] | undefined
  const decorativeFields = uiSchema?.['ui:decorativeFields'] as Record<string, DecorativeField> | undefined
  const propertyMap = Object.fromEntries(properties.map(p => [p.name, p.content]))
  const orderedKeys = fullOrder ?? properties.map(p => p.name)

  return (
    <SectionDomain.Root className="eg-section-domain w-full" mb={8}>
      <SectionDomain.Header>
        <Box flex="1" minW={0}>
          {showHeading && (
            <SectionDomain.Heading
              className='eg-section-domain-heading'
              dangerouslySetInnerHTML={{ __html: String(title) }}
            />
          )}
          {description && (
            typeof description === 'string'
              ? (
                <SectionDomain.Description
                  className="eg-section-domain-description HtmlContent"
                  dangerouslySetInnerHTML={{ __html: String(description) }}
                />
              )
              : description
          )}
        </Box>
      </SectionDomain.Header>
      {subHeading && (
        <SectionDomain.SubHeading
          className="eg-section-domain-subheading HtmlContent"
          dangerouslySetInnerHTML={{ __html: String(subHeading) }}
        />
      )}
      <SectionDomain.Properties className='eg-section-domain-properties'>
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
      </SectionDomain.Properties>
    </SectionDomain.Root>
  )
}
