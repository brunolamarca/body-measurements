"use client";

import type { Control } from "react-hook-form";
import type { MeasurementFormValues } from "@/schemas/measurement.schema";
import { BodySilhouette } from "./BodySilhouette";
import { BodyDiagramField } from "./BodyDiagramField";

interface BodyDiagramProps {
  control: Control<MeasurementFormValues>;
}

export function BodyDiagram({ control }: BodyDiagramProps) {
  return (
    <div className="relative w-full" style={{ height: "560px" }}>
      {/* Silhouette SVG - centered */}
      <div className="absolute left-1/2 top-4 -translate-x-1/2 w-36 h-[500px]">
        <BodySilhouette />
      </div>

      {/* Connector lines SVG layer */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 1 }}
        aria-hidden="true"
      >
        {/* Weight → head top */}
        <line x1="50%" y1="24" x2="50%" y2="6" stroke="currentColor" strokeOpacity="0.3" strokeWidth="1" strokeDasharray="3 3" className="text-muted-foreground" />
        {/* Right arm → body left */}
        <line x1="23%" y1="168" x2="37%" y2="150" stroke="currentColor" strokeOpacity="0.3" strokeWidth="1" strokeDasharray="3 3" className="text-muted-foreground" />
        {/* Right forearm → body left */}
        <line x1="23%" y1="228" x2="36%" y2="220" stroke="currentColor" strokeOpacity="0.3" strokeWidth="1" strokeDasharray="3 3" className="text-muted-foreground" />
        {/* Waist above navel → torso left */}
        <line x1="28%" y1="296" x2="38%" y2="285" stroke="currentColor" strokeOpacity="0.3" strokeWidth="1" strokeDasharray="3 3" className="text-muted-foreground" />
        {/* Waist navel → torso left */}
        <line x1="28%" y1="338" x2="38%" y2="325" stroke="currentColor" strokeOpacity="0.3" strokeWidth="1" strokeDasharray="3 3" className="text-muted-foreground" />
        {/* Right thigh */}
        <line x1="24%" y1="396" x2="38%" y2="385" stroke="currentColor" strokeOpacity="0.3" strokeWidth="1" strokeDasharray="3 3" className="text-muted-foreground" />
        {/* Right calf */}
        <line x1="24%" y1="455" x2="37%" y2="450" stroke="currentColor" strokeOpacity="0.3" strokeWidth="1" strokeDasharray="3 3" className="text-muted-foreground" />
        {/* Left arm → body right */}
        <line x1="77%" y1="168" x2="63%" y2="150" stroke="currentColor" strokeOpacity="0.3" strokeWidth="1" strokeDasharray="3 3" className="text-muted-foreground" />
        {/* Left forearm */}
        <line x1="77%" y1="228" x2="64%" y2="220" stroke="currentColor" strokeOpacity="0.3" strokeWidth="1" strokeDasharray="3 3" className="text-muted-foreground" />
        {/* Glutes → hip right */}
        <line x1="72%" y1="316" x2="62%" y2="308" stroke="currentColor" strokeOpacity="0.3" strokeWidth="1" strokeDasharray="3 3" className="text-muted-foreground" />
        {/* Left thigh */}
        <line x1="76%" y1="396" x2="62%" y2="385" stroke="currentColor" strokeOpacity="0.3" strokeWidth="1" strokeDasharray="3 3" className="text-muted-foreground" />
        {/* Left calf */}
        <line x1="76%" y1="455" x2="63%" y2="450" stroke="currentColor" strokeOpacity="0.3" strokeWidth="1" strokeDasharray="3 3" className="text-muted-foreground" />
      </svg>

      {/* === LEFT SIDE FIELDS (anatomical right side of body) === */}

      {/* Weight — top center */}
      <BodyDiagramField
        label="Peso"
        fieldName="weightKg"
        unit="kg"
        hint="Peso preferencialmente em jejum"
        control={control}
        side="center"
        style={{ left: "50%", top: "0px", transform: "translateX(-50%)" }}
      />

      {/* Right arm */}
      <BodyDiagramField
        label="Braço Dir."
        fieldName="rightArmCm"
        hint="Maior circunferência do braço direito (bíceps)"
        control={control}
        side="left"
        style={{ left: "0%", top: "140px" }}
      />

      {/* Right forearm */}
      <BodyDiagramField
        label="Anteb. Dir."
        fieldName="rightForearmCm"
        hint="Maior circunferência do antebraço direito"
        control={control}
        side="left"
        style={{ left: "0%", top: "198px" }}
      />

      {/* Waist above navel */}
      <BodyDiagramField
        label="Cin. s/ umbigo"
        fieldName="waistAboveNavelCm"
        hint="Cintura medida 2 dedos acima do umbigo"
        control={control}
        side="left"
        style={{ left: "0%", top: "268px" }}
      />

      {/* Waist navel */}
      <BodyDiagramField
        label="Cin. umbigo"
        fieldName="waistNavelCm"
        hint="Cintura medida na altura do umbigo"
        control={control}
        side="left"
        style={{ left: "0%", top: "308px" }}
      />

      {/* Right thigh */}
      <BodyDiagramField
        label="Coxa Dir."
        fieldName="rightThighCm"
        hint="Maior circunferência da coxa direita"
        control={control}
        side="left"
        style={{ left: "0%", top: "368px" }}
      />

      {/* Right calf */}
      <BodyDiagramField
        label="Pant. Dir."
        fieldName="rightCalfCm"
        hint="Maior circunferência da panturrilha direita"
        control={control}
        side="left"
        style={{ left: "0%", top: "428px" }}
      />

      {/* === RIGHT SIDE FIELDS (anatomical left side of body) === */}

      {/* Left arm */}
      <BodyDiagramField
        label="Braço Esq."
        fieldName="leftArmCm"
        hint="Maior circunferência do braço esquerdo (bíceps)"
        control={control}
        side="right"
        style={{ right: "0%", top: "140px" }}
      />

      {/* Left forearm */}
      <BodyDiagramField
        label="Anteb. Esq."
        fieldName="leftForearmCm"
        hint="Maior circunferência do antebraço esquerdo"
        control={control}
        side="right"
        style={{ right: "0%", top: "198px" }}
      />

      {/* Glutes */}
      <BodyDiagramField
        label="Glúteos"
        fieldName="glutesCm"
        hint="Maior circunferência dos glúteos (quadril)"
        control={control}
        side="right"
        style={{ right: "0%", top: "285px" }}
      />

      {/* Left thigh */}
      <BodyDiagramField
        label="Coxa Esq."
        fieldName="leftThighCm"
        hint="Maior circunferência da coxa esquerda"
        control={control}
        side="right"
        style={{ right: "0%", top: "368px" }}
      />

      {/* Left calf */}
      <BodyDiagramField
        label="Pant. Esq."
        fieldName="leftCalfCm"
        hint="Maior circunferência da panturrilha esquerda"
        control={control}
        side="right"
        style={{ right: "0%", top: "428px" }}
      />
    </div>
  );
}
