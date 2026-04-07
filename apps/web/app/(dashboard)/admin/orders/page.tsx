"use client";

import { useState, useMemo } from "react";
import { Search, Eye, Package, Truck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AdminOrder, AdminOrderStatus } from "@/types/admin";
import { getAdminOrders, saveAdminOrders } from "@/data/adminOrders";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";

const STATUSES: AdminOrderStatus[] = [
  "PENDIENTE",
  "PROCESANDO",
  "ENVIADO",
  "ENTREGADO",
  "CANCELADO",
];

const statusColor: Record<AdminOrderStatus, string> = {
  PENDIENTE: "bg-yellow-500/20 text-yellow-500 border-yellow-500/30",
  PROCESANDO: "bg-blue-500/20 text-blue-500 border-blue-500/30",
  ENVIADO: "bg-cyan-500/20 text-cyan-500 border-cyan-500/30",
  ENTREGADO: "bg-green-500/20 text-green-500 border-green-500/30",
  CANCELADO: "bg-red-500/20 text-red-500 border-red-500/30",
};

const PAGE_SIZE = 5;

const AdminOrders = () => {
  const [orders, setOrders] = useState<AdminOrder[]>(getAdminOrders);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [detailOrder, setDetailOrder] = useState<AdminOrder | null>(null);

  // Tracking modal state
  const [trackingModal, setTrackingModal] = useState<{
    orderId: string;
  } | null>(null);
  const [trackingCode, setTrackingCode] = useState("");
  const [trackingNote, setTrackingNote] = useState("");
  const [trackingError, setTrackingError] = useState("");

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const matchSearch =
        o.id.toLowerCase().includes(search.toLowerCase()) ||
        o.customerName.toLowerCase().includes(search.toLowerCase()) ||
        o.customerEmail.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "all" || o.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [orders, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const changeStatus = (orderId: string, newStatus: AdminOrderStatus) => {
    if (newStatus === "ENVIADO") {
      setTrackingModal({ orderId });
      setTrackingCode("");
      setTrackingNote("");
      setTrackingError("");
      return;
    }
    const updated = orders.map((o) =>
      o.id === orderId ? { ...o, status: newStatus } : o,
    );
    saveAdminOrders(updated);
    setOrders(updated);
    toast.success(`Estado actualizado a ${newStatus}`);
  };

  const confirmTracking = () => {
    if (trackingCode.trim().length < 5) {
      setTrackingError("El código debe tener al menos 5 caracteres");
      return;
    }
    if (!trackingModal) return;

    const updated = orders.map((o) =>
      o.id === trackingModal.orderId
        ? {
            ...o,
            status: "ENVIADO" as AdminOrderStatus,
            trackingCode: trackingCode.trim(),
            trackingNote: trackingNote.trim() || undefined,
          }
        : o,
    );
    saveAdminOrders(updated);
    setOrders(updated);
    setTrackingModal(null);
    toast.success(
      `Pedido marcado como enviado. Código de seguimiento: ${trackingCode.trim()}`,
    );
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-foreground">Pedidos</h1>

        {/* Filters */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por ID, cliente..."
              className="pl-9"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={(v) => {
              setStatusFilter(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-full sm:w-44">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead className="hidden sm:table-cell">Fecha</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="py-8 text-center text-muted-foreground"
                  >
                    No se encontraron pedidos
                  </TableCell>
                </TableRow>
              ) : (
                paginated.map((o) => (
                  <TableRow key={o.id}>
                    <TableCell className="font-mono text-xs">{o.id}</TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground">
                      {o.date}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium">{o.customerName}</p>
                        <p className="text-xs text-muted-foreground hidden md:block">
                          {o.customerEmail}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>€{o.total.toFixed(2)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <Select
                          value={o.status}
                          onValueChange={(v) =>
                            changeStatus(o.id, v as AdminOrderStatus)
                          }
                        >
                          <SelectTrigger className="h-8 w-32 border-0 p-0">
                            <Badge
                              variant="outline"
                              className={statusColor[o.status]}
                            >
                              {o.status}
                            </Badge>
                          </SelectTrigger>
                          <SelectContent>
                            {STATUSES.map((s) => (
                              <SelectItem key={s} value={s}>
                                {s}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {o.trackingCode && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Truck className="h-4 w-4 text-cyan-500" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-xs">
                                Seguimiento: {o.trackingCode}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDetailOrder(o)}
                        aria-label="Ver detalle"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Anterior
            </Button>
            <span className="text-sm text-muted-foreground">
              {page} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              Siguiente
            </Button>
          </div>
        )}

        {/* Tracking modal */}
        <Dialog
          open={!!trackingModal}
          onOpenChange={(open) => {
            if (!open) setTrackingModal(null);
          }}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Agregar código de seguimiento
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Código de seguimiento *
                </label>
                <Input
                  placeholder="Ej: ES1234567890"
                  value={trackingCode}
                  onChange={(e) => {
                    setTrackingCode(e.target.value);
                    setTrackingError("");
                  }}
                />
                {trackingError && (
                  <p className="text-xs text-destructive">{trackingError}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Nota adicional
                </label>
                <Textarea
                  placeholder="Información adicional sobre el envío..."
                  value={trackingNote}
                  onChange={(e) => setTrackingNote(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={() => setTrackingModal(null)}>
                Cancelar
              </Button>
              <Button onClick={confirmTracking}>Confirmar envío</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Detail modal */}
        <Dialog
          open={!!detailOrder}
          onOpenChange={(open) => {
            if (!open) setDetailOrder(null);
          }}
        >
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Pedido {detailOrder?.id}</DialogTitle>
            </DialogHeader>
            {detailOrder && (
              <div className="space-y-4">
                <div className="grid gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cliente</span>
                    <span className="font-medium">
                      {detailOrder.customerName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email</span>
                    <span>{detailOrder.customerEmail}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Dirección</span>
                    <span className="text-right max-w-[60%]">
                      {detailOrder.shippingAddress}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Fecha</span>
                    <span>{detailOrder.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Estado</span>
                    <Badge
                      variant="outline"
                      className={statusColor[detailOrder.status]}
                    >
                      {detailOrder.status}
                    </Badge>
                  </div>
                </div>

                {/* Tracking info */}
                {detailOrder.trackingCode && (
                  <div className="rounded-lg border border-border bg-muted/30 p-3 space-y-1.5">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Truck className="h-4 w-4 text-cyan-500" />
                      Información de envío
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Código de seguimiento
                      </span>
                      <a
                        href="#"
                        className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors"
                      >
                        {detailOrder.trackingCode}
                      </a>
                    </div>
                    {detailOrder.trackingNote && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Nota</span>
                        <span className="text-right max-w-[60%]">
                          {detailOrder.trackingNote}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                <div className="border-t border-border pt-3">
                  <p className="mb-2 text-sm font-medium">Productos</p>
                  <div className="space-y-3">
                    {detailOrder.items.map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-12 w-12 rounded object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {item.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {item.size} / {item.color} × {item.quantity}
                          </p>
                        </div>
                        <span className="text-sm font-medium">
                          €{(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between border-t border-border pt-3 text-sm font-semibold">
                  <span>Total</span>
                  <span>€{detailOrder.total.toFixed(2)}</span>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
};

export default AdminOrders;
