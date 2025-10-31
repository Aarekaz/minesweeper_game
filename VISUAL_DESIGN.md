# 🎨 Visual Design Guide

## Color Palette

### Primary Colors
- **Primary Gradient**: `#667eea → #764ba2` (Purple to Purple-pink)
- **Accent Gradient**: `#667eea → #764ba2 → #f093fb` (Extended rainbow)
- **Success**: `#10b981 → #059669` (Green)
- **Danger**: `#ef4444 → #dc2626` (Red)
- **Warning**: `#fbbf24 → #f59e0b` (Gold)

### Cell States
- **Hidden Cell**: `#667eea → #764ba2` (Primary gradient)
- **Revealed Cell**: `#f8fafc → #e2e8f0` (Light gray gradient)
- **Flagged Cell**: `#fbbf24 → #f59e0b` (Gold gradient)
- **Questioned Cell**: `#a78bfa → #8b5cf6` (Light purple gradient)
- **Mine Cell**: `#fee2e2 → #fecaca` (Light red gradient)

### Number Colors (Revealed Cells)
1. `#2563eb` - Blue
2. `#16a34a` - Green
3. `#dc2626` - Red
4. `#7c3aed` - Purple
5. `#ea580c` - Orange
6. `#0891b2` - Cyan
7. `#1f2937` - Dark Gray
8. `#6b7280` - Gray

## Typography

### Fonts
- **Primary**: 'Inter' - Clean, modern sans-serif
- **Monospace**: 'JetBrains Mono' - For numbers and timer

### Font Weights
- Light (300) - Subtle text
- Regular (400) - Body text
- Medium (500) - Emphasized text
- SemiBold (600) - Headings
- Bold (700) - Important elements
- ExtraBold (800) - Titles
- Black (900) - Main title

### Font Sizes
- **App Title**: 48px (desktop) → 24px (mobile)
- **Modal Headers**: 28-32px
- **Stats Numbers**: 20-32px
- **Cell Numbers**: 16px
- **Body Text**: 14-16px
- **Labels**: 11-13px

## Layout

### Spacing Scale
```
xs:  4px   - Grid gaps, small padding
sm:  8px   - Component spacing
md:  12px  - Card padding
lg:  16px  - Section spacing
xl:  20px  - Large spacing
2xl: 24px  - Major sections
3xl: 32px  - Page sections
```

### Border Radius
- **Small**: 4px - Revealed cells
- **Medium**: 6-8px - Hidden cells, inputs
- **Large**: 12px - Cards, buttons
- **XL**: 16px - Modals, board
- **Round**: 50% - Reset button

## Components

### Header
```
Background: Linear gradient #667eea → #764ba2
Height: Auto (responsive)
Padding: 24px 32px
Border Radius: 16px
Shadow: Elevated
```

### Board
```
Background: Linear gradient #1e293b → #0f172a (dark)
Padding: 20px
Border Radius: 16px
Gap: 4px
Shadow: Deep elevation
```

### Cells
```
Size: 28px × 28px (desktop)
      24px × 24px (tablet)
      20px × 20px (mobile)
Border Radius: 6px (hidden), 4px (revealed)
Transition: 0.15s cubic-bezier
```

### Buttons
```
Primary: Gradient background
Secondary: Light gray background
Padding: 12px 24px
Border Radius: 10px
Font Weight: 600
```

### Modals
```
Background: White with subtle gradient
Max Width: 600px (stats), 500px (welcome)
Padding: 32px
Border Radius: 20px
Shadow: Very elevated
Backdrop: Blur(8px) + Dark overlay
```

## Animations

### Timing Functions
- **Default**: `cubic-bezier(0.4, 0, 0.2, 1)` - Smooth ease
- **Bounce**: `ease-out` - Playful effects
- **Linear**: For continuous animations

### Animation Durations
- **Instant**: 0.15s - Hover effects
- **Quick**: 0.2s - Button clicks
- **Normal**: 0.3s - Cell reveals, flags
- **Slow**: 0.4s - Modals, board entrance
- **Very Slow**: 0.6s - Welcome screen

### Key Animations

#### Cell Reveal
```css
0%: scale(0.8), opacity 0.8
50%: scale(1.1)
100%: scale(1), opacity 1
```

#### Mine Explosion
```css
0%: scale(0.8)
50%: scale(1.1)
100%: scale(1)
```

#### Flag Wave
```css
0%: rotate(0deg)
25%: rotate(-15deg)
75%: rotate(15deg)
100%: rotate(0deg)
```

#### Bounce
```css
0%, 100%: scale(1)
50%: scale(1.2)
```

#### Float
```css
0%, 100%: translateY(0px)
50%: translateY(-5px)
```

## Visual Effects

### Shadows

#### Elevation 1 (Cells)
```css
box-shadow: 0 1px 3px rgba(0,0,0,0.12),
            0 1px 2px rgba(0,0,0,0.24);
```

#### Elevation 2 (Buttons)
```css
box-shadow: 0 4px 6px rgba(0,0,0,0.1),
            0 2px 4px rgba(0,0,0,0.06);
```

#### Elevation 3 (Header)
```css
box-shadow: 0 10px 15px rgba(0,0,0,0.2),
            0 4px 6px rgba(0,0,0,0.1);
```

#### Elevation 4 (Board)
```css
box-shadow: 0 20px 25px rgba(0,0,0,0.3),
            0 10px 10px rgba(0,0,0,0.2);
```

#### Elevation 5 (Modals)
```css
box-shadow: 0 25px 50px rgba(0,0,0,0.25);
```

### Glassmorphism
```css
background: rgba(255, 255, 255, 0.1);
backdrop-filter: blur(10px);
border: 1px solid rgba(255, 255, 255, 0.2);
```

### Gradients

#### Primary Button
```css
linear-gradient(135deg, #667eea 0%, #764ba2 100%)
```

#### Page Background
```css
linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)
```

#### Success Message
```css
linear-gradient(135deg, #10b981 0%, #059669 100%)
```

#### Danger Message
```css
linear-gradient(135deg, #ef4444 0%, #dc2626 100%)
```

## Responsive Breakpoints

```css
/* Mobile */
@media (max-width: 480px) {
  /* Smallest screens */
}

/* Tablet */
@media (max-width: 768px) {
  /* Medium screens */
}

/* Desktop */
@media (max-width: 1024px) {
  /* Large screens */
}
```

## Accessibility

### Touch Targets
- Minimum: 44px × 44px (mobile)
- Optimal: 48px × 48px

### Color Contrast
- Text on gradient: White with shadow (WCAG AAA)
- Numbers: High contrast colors (WCAG AA+)
- Buttons: Clear visual distinction

### Focus States
- Visible focus rings
- Keyboard navigation support
- Screen reader friendly

## Design Principles

1. **Consistency**: Same patterns throughout
2. **Hierarchy**: Clear visual importance
3. **Feedback**: Immediate visual response
4. **Delight**: Smooth, playful animations
5. **Clarity**: Easy to understand states
6. **Performance**: Smooth 60fps animations
7. **Accessibility**: Usable by everyone

## Inspiration

This design draws from:
- **Modern UI Trends**: Glassmorphism, gradients, smooth shadows
- **Material Design**: Elevation system, responsive grid
- **Fluent Design**: Acrylic backgrounds, responsive animations
- **Gaming Aesthetics**: Vibrant colors, satisfying feedback

---

**Every pixel crafted with care** ✨
