import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2, Building } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SignUpForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [signupType, setSignupType] = useState<"new" | "join">("new");

  // New company fields
  const [companyName, setCompanyName] = useState("");
  const [companySlug, setCompanySlug] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [companyPhone, setCompanyPhone] = useState("");

  // Join existing company fields
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [companies, setCompanies] = useState<any[]>([]);

  const navigate = useNavigate();

  // Fetch existing companies for join option
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const { data, error } = await supabase
          .from("companies")
          .select("id, name, slug")
          .eq("is_active", true)
          .order("name");

        if (error) throw error;
        setCompanies(data || []);
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    };

    fetchCompanies();
  }, []);

  // Auto-generate slug from company name
  useEffect(() => {
    if (companyName) {
      const slug = companyName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setCompanySlug(slug);
    }
  }, [companyName]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate inputs
    if (!email || !password) {
      setError("Email dan password harus diisi");
      return;
    }

    if (password !== confirmPassword) {
      setError("Password dan konfirmasi password tidak cocok");
      return;
    }

    if (password.length < 6) {
      setError("Password minimal 6 karakter");
      return;
    }

    // Validate company selection
    if (signupType === "new") {
      if (!companyName || !companySlug) {
        setError("Nama perusahaan dan slug harus diisi");
        return;
      }
    } else {
      if (!selectedCompanyId) {
        setError("Pilih perusahaan yang ingin diikuti");
        return;
      }
    }

    try {
      setLoading(true);
      let companyId = selectedCompanyId;

      // Create new company if signup type is "new"
      if (signupType === "new") {
        const { data: companyData, error: companyError } = await supabase
          .from("companies")
          .insert({
            name: companyName,
            slug: companySlug,
            address: companyAddress,
            phone: companyPhone,
            email: email, // Use user's email as company email initially
          })
          .select()
          .single();

        if (companyError) {
          if (companyError.code === "23505") {
            setError(
              "Slug perusahaan sudah digunakan, silakan gunakan yang lain",
            );
          } else {
            setError("Gagal membuat perusahaan: " + companyError.message);
          }
          return;
        }

        companyId = companyData.id;
      }

      // Sign up user with company_id
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            role: signupType === "new" ? "pemilik" : "user",
            company_id: companyId,
          },
        },
      });

      if (error) throw error;

      // Registration successful
      alert(
        "Pendaftaran berhasil! Silakan periksa email Anda untuk verifikasi.",
      );
      navigate("/login");
    } catch (error: any) {
      setError(error.message || "Terjadi kesalahan saat mendaftar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-white">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Daftar Akun
        </CardTitle>
        <CardDescription className="text-center">
          Buat akun baru untuk menggunakan aplikasi KasirSmart
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSignUp} className="space-y-4">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Tabs
            value={signupType}
            onValueChange={(value) => setSignupType(value as "new" | "join")}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="new" className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                Buat Perusahaan Baru
              </TabsTrigger>
              <TabsTrigger value="join">
                Bergabung dengan Perusahaan
              </TabsTrigger>
            </TabsList>

            <TabsContent value="new" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Nama Perusahaan</Label>
                <Input
                  id="companyName"
                  placeholder="PT. Contoh Perusahaan"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="companySlug">Slug Perusahaan</Label>
                <Input
                  id="companySlug"
                  placeholder="pt-contoh-perusahaan"
                  value={companySlug}
                  onChange={(e) => setCompanySlug(e.target.value)}
                  disabled={loading}
                  required
                />
                <p className="text-xs text-gray-500">
                  Slug akan digunakan untuk URL perusahaan Anda
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyAddress">
                  Alamat Perusahaan (Opsional)
                </Label>
                <Input
                  id="companyAddress"
                  placeholder="Jl. Contoh No. 123, Jakarta"
                  value={companyAddress}
                  onChange={(e) => setCompanyAddress(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyPhone">
                  Telepon Perusahaan (Opsional)
                </Label>
                <Input
                  id="companyPhone"
                  placeholder="+62 21 1234567"
                  value={companyPhone}
                  onChange={(e) => setCompanyPhone(e.target.value)}
                  disabled={loading}
                />
              </div>
            </TabsContent>

            <TabsContent value="join" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="company">Pilih Perusahaan</Label>
                <Select
                  value={selectedCompanyId}
                  onValueChange={setSelectedCompanyId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih perusahaan yang ingin diikuti" />
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map((company) => (
                      <SelectItem key={company.id} value={company.id}>
                        {company.name} ({company.slug})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {companies.length === 0 && (
                  <p className="text-xs text-gray-500">
                    Belum ada perusahaan yang tersedia. Buat perusahaan baru
                    terlebih dahulu.
                  </p>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="nama@perusahaan.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Konfirmasi Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {signupType === "new"
                  ? "Membuat Perusahaan..."
                  : "Mendaftar..."}
              </>
            ) : signupType === "new" ? (
              "Buat Perusahaan & Daftar"
            ) : (
              "Daftar"
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <div className="text-sm text-center">
          Sudah memiliki akun?{" "}
          <Button
            variant="link"
            className="p-0"
            onClick={() => navigate("/login")}
          >
            Masuk di sini
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default SignUpForm;
