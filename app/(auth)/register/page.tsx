// app/(auth)/register/page.tsx
"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { signUpAction } from "@/app/actions";
import { toast } from "sonner";
import { ChevronLeft } from "lucide-react";

interface Province {
  id: string;
  name: string;
}

interface City {
  id: string;
  name: string;
}

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    password: "",
    confirmPassword: "",
    farm_name: "",
    commodity_type: "",
    land_area: "",
    province: "",
    city: "",
    full_address: "",
    postal_code: "",
    terms: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [provinces, setProvinces] = useState<Province[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedProvinceId, setSelectedProvinceId] = useState<string>("");
  const [isLoadingCities, setIsLoadingCities] = useState(false);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await fetch(
          "https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json"
        );
        const data = await response.json();
        setProvinces(data);
      } catch (error) {
        console.error("Gagal mengambil data provinsi:", error);
        toast.error("Gagal memuat daftar provinsi.");
      }
    };
    fetchProvinces();
  }, []);

  useEffect(() => {
    if (selectedProvinceId) {
      const fetchCities = async () => {
        setIsLoadingCities(true);
        try {
          const response = await fetch(
            `https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${selectedProvinceId}.json`
          );
          const data = await response.json();
          setCities(data);
        } catch (error) {
          console.error("Gagal mengambil data kota:", error);
          toast.error("Gagal memuat daftar kota/kabupaten.");
        } finally {
          setIsLoadingCities(false);
        }
      };
      fetchCities();
    } else {
      setCities([]);
    }
  }, [selectedProvinceId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (name === "email") validateEmail(value);
    if (name === "phone_number") validatePhoneNumber(value);
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "province") {
      const province = provinces.find((p) => p.name === value);
      setSelectedProvinceId(province ? province.id : "");
      setFormData((prev) => ({ ...prev, city: "" }));
    }
  };

  const validateEmail = (email: string) => {
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setErrors((prev) => ({ ...prev, email: "Format email tidak valid." }));
    } else {
      setErrors((prev) => ({ ...prev, email: "" }));
    }
  };

  const validatePhoneNumber = (phone: string) => {
    if (!/^(^\+62|62|^08)(\d{3,4}-?){2}\d{3,4}$/.test(phone)) {
      setErrors((prev) => ({
        ...prev,
        phone_number:
          "Format nomor HP tidak valid (contoh: 0812... atau +62...)",
      }));
    } else {
      setErrors((prev) => ({ ...prev, phone_number: "" }));
    }
  };

  const validateStep = () => {
    const newErrors: Record<string, string> = {};
    if (step === 1) {
      if (!formData.full_name)
        newErrors.full_name = "Nama lengkap wajib diisi.";
      if (!formData.email) newErrors.email = "Email wajib diisi.";
      if (!formData.phone_number)
        newErrors.phone_number = "Nomor HP wajib diisi.";
      if (!formData.password) newErrors.password = "Kata sandi wajib diisi.";
      if (formData.password.length < 6)
        newErrors.password = "Kata sandi minimal 6 karakter.";
      if (formData.password !== formData.confirmPassword)
        newErrors.confirmPassword = "Konfirmasi kata sandi tidak cocok.";
    }
    if (step === 2) {
      if (!formData.commodity_type)
        newErrors.commodity_type = "Jenis komoditas wajib diisi.";
      if (!formData.province) newErrors.province = "Provinsi wajib diisi.";
      if (!formData.city) newErrors.city = "Kabupaten/Kota wajib diisi.";
      if (!formData.full_address)
        newErrors.full_address = "Alamat lengkap wajib diisi.";
      if (!formData.postal_code)
        newErrors.postal_code = "Kode pos wajib diisi.";
    }
    if (step === 3) {
      if (!formData.terms)
        newErrors.terms = "Anda harus menyetujui Syarat & Ketentuan.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) setStep(step + 1);
  };

  const handlePrev = () => setStep(step - 1);

  const handleSignUp = async (formActionData: FormData) => {
    if (!validateStep()) return;
    Object.entries(formData).forEach(([key, value]) => {
      formActionData.set(key, String(value));
    });
    const result = await signUpAction(formActionData);
    if (result?.error) {
      setErrors({ form: result.error });
    } else {
      setErrors({});
      toast.success("Pendaftaran Berhasil!", {
        description:
          "Silakan cek email Anda untuk verifikasi dan kemudian login.",
      });
      setStep(4);
    }
  };

  const progress = useMemo(() => Math.round(((step - 1) / 3) * 100), [step]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-lg shadow-lg relative">
        <div className="absolute top-4 left-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/">
              <ChevronLeft className="h-6 w-6" />
            </Link>
          </Button>
        </div>
        <CardHeader className="text-center pt-12">
          <CardTitle className="text-3xl font-bold text-green-800">
            Buat Akun Agri-Gear
          </CardTitle>
          {step <= 3 && (
            <>
              <CardDescription>Langkah {step} dari 3</CardDescription>
              <Progress value={progress} className="w-full mt-2" />
            </>
          )}
        </CardHeader>
        <CardContent>
          <form action={handleSignUp}>
            {step === 1 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">1. Informasi Akun</h3>
                <div>
                  <Label htmlFor="full_name">Nama Lengkap</Label>
                  <Input
                    id="full_name"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    required
                  />
                  {errors.full_name && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.full_name}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="phone_number">Nomor HP</Label>
                  <Input
                    id="phone_number"
                    name="phone_number"
                    type="tel"
                    value={formData.phone_number}
                    onChange={handleChange}
                    required
                  />
                  {errors.phone_number && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.phone_number}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="password">Kata Sandi</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Konfirmasi Kata Sandi</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">2. Profil & Alamat</h3>
                <div>
                  <Label htmlFor="farm_name">
                    Nama Usaha / Kelompok Tani (Opsional)
                  </Label>
                  <Input
                    id="farm_name"
                    name="farm_name"
                    value={formData.farm_name}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label htmlFor="commodity_type">Jenis Komoditas</Label>
                  <Input
                    id="commodity_type"
                    name="commodity_type"
                    placeholder="Padi, Jagung, Hortikultura..."
                    value={formData.commodity_type}
                    onChange={handleChange}
                    required
                  />
                  {errors.commodity_type && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.commodity_type}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="land_area">
                    Luas Lahan (hektar) (Opsional)
                  </Label>
                  <Input
                    id="land_area"
                    name="land_area"
                    type="number"
                    step="0.1"
                    value={formData.land_area}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="province">Provinsi</Label>
                    <Select
                      name="province"
                      onValueChange={(v) => handleSelectChange("province", v)}
                      value={formData.province}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Provinsi" />
                      </SelectTrigger>
                      <SelectContent>
                        {provinces.map((p) => (
                          <SelectItem key={p.id} value={p.name}>
                            {p.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.province && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.province}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="city">Kabupaten/Kota</Label>
                    <Select
                      name="city"
                      onValueChange={(v) => handleSelectChange("city", v)}
                      value={formData.city}
                      disabled={!selectedProvinceId || isLoadingCities}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            isLoadingCities
                              ? "Memuat..."
                              : "Pilih Kabupaten/Kota"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map((c) => (
                          <SelectItem key={c.id} value={c.name}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.city && (
                      <p className="text-red-500 text-xs mt-1">{errors.city}</p>
                    )}
                  </div>
                </div>
                <div>
                  <Label htmlFor="full_address">Alamat Lengkap</Label>
                  <Input
                    id="full_address"
                    name="full_address"
                    value={formData.full_address}
                    onChange={handleChange}
                    required
                  />
                  {errors.full_address && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.full_address}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="postal_code">Kode Pos</Label>
                  <Input
                    id="postal_code"
                    name="postal_code"
                    value={formData.postal_code}
                    onChange={handleChange}
                    required
                  />
                  {errors.postal_code && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.postal_code}
                    </p>
                  )}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <h3 className="font-semibold text-lg">3. Persetujuan</h3>
                <div className="items-top flex space-x-2">
                  <Checkbox
                    id="terms"
                    name="terms"
                    onCheckedChange={(c) =>
                      setFormData((prev) => ({ ...prev, terms: !!c }))
                    }
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor="terms"
                      className="text-sm font-medium leading-none"
                    >
                      Saya setuju dengan{" "}
                      <a href="#" className="text-green-700 hover:underline">
                        Syarat & Ketentuan
                      </a>{" "}
                      yang berlaku.
                    </label>
                  </div>
                </div>
                {errors.terms && (
                  <p className="text-red-500 text-xs mt-1">{errors.terms}</p>
                )}
                <div className="items-top flex space-x-2">
                  <Checkbox id="notifications" />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor="notifications"
                      className="text-sm font-medium leading-none"
                    >
                      Saya bersedia menerima notifikasi dan pembaruan via email.
                    </label>
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="text-center space-y-4">
                <h3 className="text-2xl font-bold text-green-800">
                  Pendaftaran Berhasil!
                </h3>
                <p className="text-gray-600">
                  Kami telah mengirimkan link verifikasi ke email Anda. Silakan
                  periksa kotak masuk Anda untuk melanjutkan.
                </p>
                <Button asChild>
                  <Link href="/login">Kembali ke Halaman Login</Link>
                </Button>
              </div>
            )}

            {errors.form && (
              <p className="text-sm text-red-600 mt-4 text-center">
                {errors.form}
              </p>
            )}

            {step <= 3 && (
              <div className="flex justify-between mt-6">
                {step > 1 ? (
                  <Button type="button" variant="outline" onClick={handlePrev}>
                    Kembali
                  </Button>
                ) : (
                  <div />
                )}
                {step < 3 ? (
                  <Button type="button" onClick={handleNext}>
                    Lanjutkan
                  </Button>
                ) : (
                  <Button type="submit">Daftar Sekarang</Button>
                )}
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
