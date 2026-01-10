import PendingFirms from "./PendingFirms";
import PendingUsers from "./PendingUsers";

export default function AdminApprovals() {
    return (
        <div className="space-y-12">
            <h1 className="text-2xl font-bold text-slate-900">
                Администратор – Одобрения
            </h1>

            <PendingFirms />
            <PendingUsers />
        </div>
    );
}
