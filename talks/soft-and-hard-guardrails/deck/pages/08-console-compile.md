---
layout: console
---

# A dependency edge, rejected at project load

```xml
<!-- Directory.Build.props — runs before references resolve -->
<Target Name="ArchVerifyModuleReferences"
        BeforeTargets="ResolveProjectReferences">
  <Error Condition="'@(_ArchIllegalRef)' != '' and '$(ArchSkipReferenceGuard)' != 'true'"
         Text="Module '$(MSBuildProjectName)' must not reference '@(_ArchIllegalRef)'" />
</Target>
```

The project reference itself is rejected.
The illegal dependency never reaches application code.
