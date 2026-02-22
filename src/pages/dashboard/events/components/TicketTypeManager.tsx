import { useState } from 'react';
import { Ticket, Plus, Save, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useConfirmDialog } from '@/components/ui/useConfirmDialog';
import Input from '@/components/ui/Input';
import Label from '@/components/ui/Label';
import Button from '@/components/ui/Button';
import type { TicketType } from '@/types/models';
import type { CreateTicketTypePayload } from '@/features/events/types';

type ManagerProps = {
  ticketTypes: TicketType[];
  isLoading: boolean;
  onAdd: (payload: CreateTicketTypePayload) => Promise<TicketType>;
  onUpdate: (
    id: string,
    payload: Partial<CreateTicketTypePayload>
  ) => Promise<TicketType>;
  onDelete: (id: string) => Promise<void>;
};

export default function TicketTypeManager({
  ticketTypes,
  isLoading,
  onAdd,
  onUpdate,
  onDelete
}: ManagerProps) {
  const { confirm, dialog } = useConfirmDialog();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states for add/edit
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [quota, setQuota] = useState('');

  const resetForm = () => {
    setName('');
    setDescription('');
    setPrice('');
    setQuota('');
    setIsAdding(false);
    setEditingId(null);
  };

  const startEdit = (t: TicketType) => {
    setName(t.name);
    setDescription(t.description || '');
    setPrice(t.price.toString());
    setQuota(t.quota.toString());
    setEditingId(t.id);
    setIsAdding(false);
  };

  const handleSave = async () => {
    if (!name.trim()) return;
    const payload = {
      name: name.trim(),
      description: description.trim() || undefined,
      price: Number(price) || 0,
      quota: Number(quota) || 1
    };

    if (editingId) {
      const t = ticketTypes.find(x => x.id === editingId);
      if (t && payload.quota < t.soldCount) {
        toast.error(`Quota cannot be less than sold tickets (${t.soldCount})`);
        return;
      }
      await onUpdate(editingId, payload);
    } else {
      await onAdd(payload);
    }
    resetForm();
  };

  return (
    <>
      <Card className="border-0 shadow-lg overflow-hidden">
        <CardHeader className="bg-linear-to-r from-primary/10 via-primary/5 to-transparent">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Ticket className="h-5 w-5 text-primary" />
              Manage Ticket Types
            </div>
            {!isAdding && !editingId && (
              <Button size="sm" onClick={() => setIsAdding(true)}>
                <Plus className="h-4 w-4 mr-1" /> Add Ticket
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          {/* Existing List */}
          {ticketTypes.map(t => (
            <div
              key={t.id}
              className="p-4 rounded-xl border border-border bg-muted/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              {editingId === t.id ? (
                <div className="w-full space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Name *</Label>
                      <Input
                        value={name}
                        onChange={e => setName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Input
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Price (IDR) *</Label>
                      <Input
                        type="number"
                        min="0"
                        value={price}
                        onChange={e => setPrice(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Quota (Sold: {t.soldCount}) *</Label>
                      <Input
                        type="number"
                        min={t.soldCount || 1}
                        value={quota}
                        onChange={e => setQuota(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={resetForm}
                      disabled={isLoading}>
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSave}
                      disabled={isLoading || !name}>
                      <Save className="h-4 w-4 mr-1" /> Save
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground">{t.name}</h4>
                    {t.description && (
                      <p className="text-sm text-muted-foreground">
                        {t.description}
                      </p>
                    )}
                    <div className="flex gap-4 mt-2 text-sm text-foreground">
                      <span>Price: IDR {t.price.toLocaleString('id-ID')}</span>
                      <span>
                        Quota: {t.soldCount}/{t.quota}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 sm:flex-none"
                      onClick={() => startEdit(t)}
                      disabled={isLoading || isAdding}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 sm:flex-none text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() =>
                        confirm({
                          title: 'Delete Ticket',
                          description:
                            'This ticket type will be permanently deleted.',
                          variant: 'destructive',
                          onConfirm: () => onDelete(t.id)
                        })
                      }
                      disabled={isLoading || isAdding || t.soldCount > 0}
                      title={
                        t.soldCount > 0
                          ? 'Cannot delete ticket with sold items'
                          : 'Delete'
                      }>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              )}
            </div>
          ))}

          {ticketTypes.length === 0 && !isAdding && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No ticket types found.
            </p>
          )}

          {/* Add Form */}
          {isAdding && (
            <div className="p-4 rounded-xl border-2 border-primary/50 bg-primary/5 space-y-4">
              <h4 className="font-semibold text-foreground border-b border-border/50 pb-2">
                Add New Ticket
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Name *</Label>
                  <Input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Early Bird"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Optional"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Price (IDR) *</Label>
                  <Input
                    type="number"
                    min="0"
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                    placeholder="0 = Free"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Quota *</Label>
                  <Input
                    type="number"
                    min="1"
                    value={quota}
                    onChange={e => setQuota(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetForm}
                  disabled={isLoading}>
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={isLoading || !name}>
                  <Save className="h-4 w-4 mr-1" /> Add Ticket
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {dialog}
    </>
  );
}
