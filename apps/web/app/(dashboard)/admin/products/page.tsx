"use client";

import { useState, useMemo } from "react";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AdminProduct } from "@/types/admin";
import { getAdminProducts, saveAdminProducts } from "@/data/adminProducts";
import { categories } from "@/data/products";
import { toast } from "sonner";
import ProductForm from "@/components/admin/ProductForm";
import { Button } from "@/components/ui/Button";

const PAGE_SIZE = 5;

const AdminProducts = () => {
  const [products, setProducts] = useState<AdminProduct[]>(getAdminProducts);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<AdminProduct | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchCat = catFilter === "all" || p.category === catFilter;
      return matchSearch && matchCat;
    });
  }, [products, search, catFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const totalStock = (p: AdminProduct) =>
    p.variants.reduce((s, v) => s + v.stock, 0);

  const handleSave = (product: AdminProduct) => {
    let updated: AdminProduct[];
    if (editProduct) {
      updated = products.map((p) => (p.id === product.id ? product : p));
    } else {
      const maxId = products.reduce((m, p) => Math.max(m, p.id), 0);
      updated = [...products, { ...product, id: maxId + 1 }];
    }
    saveAdminProducts(updated);
    setProducts(updated);
    setFormOpen(false);
    setEditProduct(null);
    toast.success(editProduct ? "Producto actualizado" : "Producto creado");
  };

  const handleDelete = () => {
    if (deleteId === null) return;
    const updated = products.filter((p) => p.id !== deleteId);
    saveAdminProducts(updated);
    setProducts(updated);
    setDeleteId(null);
    toast.success("Producto eliminado");
  };

  const openEdit = (p: AdminProduct) => {
    setEditProduct(p);
    setFormOpen(true);
  };

  const openCreate = () => {
    setEditProduct(null);
    setFormOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-foreground">Productos</h1>
        <Button onClick={openCreate} className="gap-2">
          <Plus className="h-4 w-4" /> Crear producto
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar producto..."
            className="pl-9"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <Select
          value={catFilter}
          onValueChange={(v) => {
            setCatFilter(v);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="Categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
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
              <TableHead className="w-12">Img</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead className="hidden sm:table-cell">Categoría</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead className="hidden md:table-cell">Stock</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center text-muted-foreground py-8"
                >
                  No se encontraron productos
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>
                    <img
                      src={p.image}
                      alt={p.name}
                      className="h-10 w-10 rounded object-cover"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell className="hidden sm:table-cell text-muted-foreground">
                    {p.category}
                  </TableCell>
                  <TableCell>€{p.price.toFixed(2)}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {totalStock(p)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEdit(p)}
                        aria-label="Editar"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(p.id)}
                        aria-label="Eliminar"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
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

      {/* Product form dialog */}
      <Dialog
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditProduct(null);
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editProduct ? "Editar producto" : "Crear producto"}
            </DialogTitle>
          </DialogHeader>
          <ProductForm
            product={editProduct}
            onSave={handleSave}
            onCancel={() => {
              setFormOpen(false);
              setEditProduct(null);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog
        open={deleteId !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteId(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar producto?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminProducts;
