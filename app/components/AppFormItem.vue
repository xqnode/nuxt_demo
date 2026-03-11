<script setup lang="ts">
import { useField } from 'vee-validate'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

const props = defineProps<{
  name: string
  label: string
  type?: string
  placeholder?: string
  disabled?: boolean
}>()
</script>

<template>
  <FormField :name="name" v-slot="{ componentField }">
    <FormItem class="space-y-0">
      <div class="flex items-center gap-4">
        <FormLabel class="w-16 text-right shrink-0 text-sm">
          <slot name="label">{{ label }}</slot>
        </FormLabel>
        <FormControl class="flex-1">
          <slot :field="componentField">
            <Input v-bind="componentField" :type="type || 'text'"
              :placeholder="placeholder" :disabled="disabled" class="h-8 text-sm" />
          </slot>
        </FormControl>
      </div>
      <div class="pl-[80px]">
        <FormMessage class="text-[10px]" />
      </div>
    </FormItem>
  </FormField>
</template>