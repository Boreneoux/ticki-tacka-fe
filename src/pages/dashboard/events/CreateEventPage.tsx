import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Ticket, Plus, X, Loader2 } from 'lucide-react';

import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Label from '@/components/ui/Label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

import { useCreateEventForm } from '@/features/events/hooks/useCreateEventForm';
import EventForm from './components/EventForm';

export default function CreateEventPage() {
  const navigate = useNavigate();
  const { formik } = useCreateEventForm();

  const addTicketRow = () => {
    if (formik.values.ticketTypes.length >= 5) return;
    formik.setFieldValue('ticketTypes', [
      ...formik.values.ticketTypes,
      { name: '', description: '', price: 0, quota: 1 }
    ]);
  };

  const removeTicketRow = (index: number) => {
    if (formik.values.ticketTypes.length <= 1) return;
    const newTickets = [...formik.values.ticketTypes];
    newTickets.splice(index, 1);
    formik.setFieldValue('ticketTypes', newTickets);
  };

  return (
    <div className="min-h-[80vh] bg-background pb-12">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 text-muted-foreground hover:text-foreground">
          <ChevronLeft className="h-4 w-4 mr-1" /> Back
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Create New Event
          </h1>
          <p className="text-muted-foreground mt-1">
            Fill in the details below to create your event. You can upload up to
            5 images.
          </p>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-8">
          {/* Shared Form Fields (Images, Basic Info, Date/Time, Location) */}
          <EventForm formik={formik} />

          {/* Ticket Types specific to Create */}
          <Card className="border-0 shadow-lg overflow-hidden">
            <CardHeader className="bg-linear-to-r from-primary/10 via-primary/5 to-transparent">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Ticket className="h-5 w-5 text-primary" />
                  Ticket Types
                </div>
                {formik.values.ticketTypes.length < 5 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addTicketRow}>
                    <Plus className="h-4 w-4 mr-1" /> Add
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              {formik.values.ticketTypes.map((ticket, index) => (
                <div
                  key={index}
                  className="p-4 rounded-xl border border-border bg-muted/30 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-foreground">
                      Ticket #{index + 1}
                    </span>
                    {formik.values.ticketTypes.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTicketRow(index)}
                        className="h-7 w-7 rounded-full hover:bg-destructive/10 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors">
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Name *</Label>
                      <Input
                        value={ticket.name}
                        onChange={e =>
                          formik.setFieldValue(
                            `ticketTypes.${index}.name`,
                            e.target.value
                          )
                        }
                        placeholder="e.g. Regular, VIP"
                      />
                      {formik.touched.ticketTypes?.[index]?.name &&
                        (
                          formik.errors.ticketTypes as Record<string, string>[]
                        )?.[index]?.name && (
                          <p className="text-[10px] text-destructive">
                            {
                              (
                                formik.errors.ticketTypes as Record<
                                  string,
                                  string
                                >[]
                              )[index].name
                            }
                          </p>
                        )}
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Input
                        value={ticket.description}
                        onChange={e =>
                          formik.setFieldValue(
                            `ticketTypes.${index}.description`,
                            e.target.value
                          )
                        }
                        placeholder="Optional description"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Price (IDR) *</Label>
                      <Input
                        type="number"
                        min="0"
                        placeholder="0"
                        value={ticket.price === 0 ? '' : ticket.price}
                        onChange={e =>
                          formik.setFieldValue(
                            `ticketTypes.${index}.price`,
                            e.target.value === '' ? 0 : Number(e.target.value)
                          )
                        }
                      />
                      {formik.touched.ticketTypes?.[index]?.price &&
                        (
                          formik.errors.ticketTypes as Record<string, string>[]
                        )?.[index]?.price && (
                          <p className="text-[10px] text-destructive">
                            {
                              (
                                formik.errors.ticketTypes as Record<
                                  string,
                                  string
                                >[]
                              )[index].price
                            }
                          </p>
                        )}
                    </div>
                    <div className="space-y-2">
                      <Label>Quota *</Label>
                      <Input
                        type="number"
                        min="1"
                        placeholder="1"
                        value={ticket.quota === 0 ? '' : ticket.quota}
                        onChange={e =>
                          formik.setFieldValue(
                            `ticketTypes.${index}.quota`,
                            e.target.value === '' ? 0 : Number(e.target.value)
                          )
                        }
                      />
                      {formik.touched.ticketTypes?.[index]?.quota &&
                        (
                          formik.errors.ticketTypes as Record<string, string>[]
                        )?.[index]?.quota && (
                          <p className="text-[10px] text-destructive">
                            {
                              (
                                formik.errors.ticketTypes as Record<
                                  string,
                                  string
                                >[]
                              )[index].quota
                            }
                          </p>
                        )}
                    </div>
                  </div>
                </div>
              ))}
              {typeof formik.errors.ticketTypes === 'string' && (
                <p className="text-sm font-medium text-destructive mt-1">
                  {formik.errors.ticketTypes}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex items-center gap-4 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
              disabled={formik.isSubmitting}>
              Cancel
            </Button>
            <Button
              type="submit"
              size="lg"
              disabled={formik.isSubmitting}
              className="min-w-45">
              {formik.isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" /> Creating...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" /> Create Event
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
