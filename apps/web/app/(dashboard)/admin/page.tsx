"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ShoppingBag, Package, TrendingUp } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const metrics = [
  {
    title: "Ventas del mes",
    value: "€12,450",
    icon: DollarSign,
    change: "+12%",
  },
  { title: "Pedidos", value: "86", icon: ShoppingBag, change: "+8%" },
  { title: "Productos activos", value: "8", icon: Package, change: "0" },
  {
    title: "Ticket promedio",
    value: "€144.77",
    icon: TrendingUp,
    change: "+5%",
  },
];

const salesData = [
  { month: "Nov", sales: 8200 },
  { month: "Dic", sales: 14500 },
  { month: "Ene", sales: 9800 },
  { month: "Feb", sales: 11200 },
  { month: "Mar", sales: 13400 },
  { month: "Abr", sales: 12450 },
];

const topProducts = [
  {
    name: "Camiseta Básica Blanca",
    qty: 42,
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=80&h=80&fit=crop",
  },
  {
    name: "Pantalón Slim Fit Negro",
    qty: 31,
    image:
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=80&h=80&fit=crop",
  },
  {
    name: "Zapatillas Urbanas",
    qty: 28,
    image:
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=80&h=80&fit=crop",
  },
  {
    name: "Chaqueta de Cuero",
    qty: 19,
    image:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=80&h=80&fit=crop",
  },
  {
    name: "Jeans Rectos Azul",
    qty: 17,
    image:
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=80&h=80&fit=crop",
  },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>

      {/* Metric cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((m) => (
          <Card key={m.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {m.title}
              </CardTitle>
              <m.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{m.value}</div>
              <p className="text-xs text-muted-foreground">
                {m.change} vs mes anterior
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Sales chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Ventas últimos 6 meses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                  />
                  <XAxis
                    dataKey="month"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickFormatter={(v) => `€${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                      color: "hsl(var(--foreground))",
                    }}
                    formatter={(value) => [
                      `€${value?.toLocaleString() || 0}`,
                      "Ventas",
                    ]}
                  />
                  <Bar
                    dataKey="sales"
                    fill="hsl(var(--foreground))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top products */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Más vendidos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {topProducts.map((p, i) => (
              <div key={p.name} className="flex items-center gap-3">
                <span className="w-5 text-xs font-semibold text-muted-foreground">
                  {i + 1}
                </span>
                <img
                  src={p.image}
                  alt={p.name}
                  className="h-9 w-9 rounded object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium">{p.name}</p>
                </div>
                <span className="text-sm font-semibold text-muted-foreground">
                  {p.qty}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
