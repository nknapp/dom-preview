<template>
  <div class="w-screen h-screen flex items-stretch">
    <aside class="w-1/4 min-w-fit bg-blue-50 border-r-blue-400 border-r p-4">
      <slot name="sidebar" />
    </aside>
    <main class="flex-1">
      <slot name="main" />
    </main>
  </div>
</template>