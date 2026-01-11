'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { SiteChecklist } from '@/types/database'
import { Plus, GripVertical, Trash2, Save } from 'lucide-react'

interface ChecklistEditorProps {
  siteId: string
  items: SiteChecklist[]
  onSave: (items: Partial<SiteChecklist>[]) => Promise<void>
}

export function ChecklistEditor({ siteId, items, onSave }: ChecklistEditorProps) {
  const [checklist, setChecklist] = useState<Partial<SiteChecklist>[]>(
    items.length > 0
      ? items.map((item) => ({ ...item }))
      : [{ task: '', sort_order: 0 }]
  )
  const [isLoading, setIsLoading] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  const handleAddItem = () => {
    setChecklist([...checklist, { task: '', sort_order: checklist.length }])
    setHasChanges(true)
  }

  const handleRemoveItem = (index: number) => {
    const newList = checklist.filter((_, i) => i !== index)
    setChecklist(newList.map((item, i) => ({ ...item, sort_order: i })))
    setHasChanges(true)
  }

  const handleItemChange = (index: number, value: string) => {
    const newList = [...checklist]
    newList[index] = { ...newList[index], task: value }
    setChecklist(newList)
    setHasChanges(true)
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      const validItems = checklist.filter((item) => item.task?.trim())
      await onSave(validItems)
      setHasChanges(false)
    } catch {
      // Save failed - parent handles the error
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-gray-900">Cleaning Checklist</h3>
        {hasChanges && (
          <Button size="sm" onClick={handleSave} isLoading={isLoading} leftIcon={<Save className="h-4 w-4" />}>
            Save Changes
          </Button>
        )}
      </div>

      <div className="space-y-2">
        {checklist.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg group"
          >
            <button className="p-1 text-gray-400 cursor-grab">
              <GripVertical className="h-4 w-4" />
            </button>
            <span className="text-sm text-gray-500 w-6">{index + 1}.</span>
            <Input
              value={item.task || ''}
              onChange={(e) => handleItemChange(index, e.target.value)}
              placeholder="Enter task..."
              className="flex-1"
            />
            <button
              onClick={() => handleRemoveItem(index)}
              className="p-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={handleAddItem}
        leftIcon={<Plus className="h-4 w-4" />}
        className="w-full"
      >
        Add Task
      </Button>

      <div className="text-sm text-gray-500">
        <p>Suggested tasks for cleaning sites:</p>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>Empty all trash bins</li>
          <li>Vacuum carpets and rugs</li>
          <li>Mop hard floors</li>
          <li>Clean and sanitize restrooms</li>
          <li>Wipe down all surfaces</li>
          <li>Clean windows and glass</li>
          <li>Restock supplies</li>
        </ul>
      </div>
    </div>
  )
}
