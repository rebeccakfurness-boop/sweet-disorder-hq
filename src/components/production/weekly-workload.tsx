import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { productionStaff } from "@/lib/mock/production";
import { scheduleEntries, weekdays } from "@/lib/mock/schedule";
import { initials } from "@/lib/utils";

export function WeeklyWorkload() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold text-foreground">Weekly Workload</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {weekdays.map((day) => {
            const dayEntries = scheduleEntries.filter((entry) => entry.day === day);
            return (
              <div key={day} className="rounded-lg border border-border bg-muted/30 p-3">
                <p className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {day}
                </p>
                <div className="space-y-3">
                  {productionStaff.map((staff) => {
                    const staffEntries = dayEntries.filter((entry) => entry.staff === staff);
                    if (staffEntries.length === 0) return null;
                    return (
                      <div key={staff}>
                        <div className="mb-1 flex items-center gap-1.5">
                          <Avatar className="h-5 w-5">
                            <AvatarFallback className="text-[9px]">{initials(staff)}</AvatarFallback>
                          </Avatar>
                          <span className="text-xs font-medium text-foreground">{staff}</span>
                        </div>
                        <ul className="space-y-1 pl-1">
                          {staffEntries.map((entry) => (
                            <li key={entry.id} className="text-xs leading-snug text-muted-foreground">
                              • {entry.label}
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                  {dayEntries.length === 0 ? (
                    <p className="text-xs text-muted-foreground">Nothing scheduled.</p>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
