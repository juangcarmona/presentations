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

The Roslyn analyzers catch a boundary violation when a type is *used*. This target catches it one step earlier: the moment the illegal reference appears in the `.csproj`. Module identity is fed to the compiler via properties, so there is no hand-maintained module list to rot — and the only bypass is a flag you must type out loud: `-p:ArchSkipReferenceGuard=true`.
