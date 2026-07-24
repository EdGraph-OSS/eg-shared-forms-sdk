interface Params {
    swatch: string
    scale: string
    shade: string
    onChange: (scale: string, shade: string, value: string) => void
}

export default function ColorTokenPicker({ 
    swatch, 
    scale, 
    shade,
    onChange
}: Params) {
    return (
        <input
            type="color"
            value={swatch}
            onChange={e => onChange(scale, shade, e.target.value)}
            style={{ width: 40, height: 40, padding: 0, border: 'none', background: 'none', flexShrink: 0 }} />
    )
}