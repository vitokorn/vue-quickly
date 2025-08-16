# Visibility Management System

## Overview

The visibility management system replaces the previous DOM manipulation approach with a more reliable and efficient solution using Vue refs and reactive maps. This system provides better performance, reduced network requests, and more stable component visibility management.

## Key Features

- **Map-based tracking**: Uses reactive maps to track component visibility and references
- **Ref-based manipulation**: Uses Vue refs instead of direct DOM queries
- **Section-based visibility**: Groups components by sections for better organization
- **Parent-child relationships**: Supports nested component hierarchies
- **Performance optimized**: Reduces DOM queries and improves rendering efficiency

## Components

### useVisibilityManager

The main composable that provides visibility management functionality.

#### State

```javascript
const visibilityState = reactive({
  visibleElements: new Map(),      // Tracks visibility state by key
  componentRefs: new Map(),        // Stores component refs by key
  activeSection: null,             // Current active section
  activeParent: null               // Current active parent
})
```

#### Methods

- `registerComponent(key, componentRef)`: Register a component with the manager
- `unregisterComponent(key)`: Remove a component from the manager
- `showComponent(key)`: Show a specific component
- `hideComponent(key)`: Hide a specific component
- `showSection(sectionKey, parentKey)`: Show all components in a section
- `hideSection(sectionKey)`: Hide all components in a section
- `isComponentVisible(key)`: Check if a component is visible
- `getActiveSection()`: Get current active section
- `getActiveParent()`: Get current active parent
- `clearAll()`: Clear all visibility state

## Usage

### In Components

```javascript
import { useVisibilityManager } from "../composables/useVisibilityManager";

const componentRef = ref(null)
const visibilityManager = useVisibilityManager()

onMounted(() => {
  // Register this component
  const key = `componentType_${props.id}`
  visibilityManager.registerComponent(key, componentRef)
  
  // Initially hide
  if (componentRef.value) {
    componentRef.value.style.display = 'none'
  }
})
```

### In Store Actions

```javascript
const visibilityManager = useVisibilityManager()

// Show specific component
visibilityManager.showComponent(`deepertracks_${item.id}`)

// Show section with parent filtering
visibilityManager.showSection(pointer, child)

// Hide section
visibilityManager.hideSection(pointer)
```

## Key Naming Convention

Components are registered with keys following this pattern:
- `deepertracks_${id}` - For track components
- `deeperplaylist_${id}` - For playlist components
- `seed_tracks_${id}` - For seed track components
- `seed_artists_${id}` - For seed artist components
- `deeperalbum_${id}` - For album components
- `trackartist_${id}` - For artist components

## Benefits

1. **Reliability**: No more DOM manipulation errors or race conditions
2. **Performance**: Faster component switching and reduced DOM queries
3. **Network Efficiency**: Components are cached and reused
4. **Maintainability**: Centralized visibility logic
5. **Scalability**: Easy to add new component types

## Migration from Old System

The old system used:
- `document.querySelectorAll()` for finding elements
- `document.getElementById()` for specific elements
- Direct `style.display` manipulation
- Complex DOM traversal logic

The new system uses:
- Reactive maps for tracking
- Vue refs for direct component access
- Centralized visibility management
- Simplified show/hide logic

## Example Workflow

1. User clicks on a track
2. Store calls `deeperTracks()` with track data
3. Visibility manager shows the track component
4. If switching sections, other components are hidden
5. Component is displayed using its ref
6. No additional network requests if component already exists

This system provides a much more stable and efficient way to manage component visibility while saving mobile data and network requests.
