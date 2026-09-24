import { Col, Row } from "react-bootstrap";
import { useState, useMemo, useEffect } from "react";
import { useGestionStore } from "@/pages/GestionUsuarios/useGestionUsuariosStore";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/stores/Store";
import { addSeccionesxEntidad, type SeccionesEntidadProps, type SeccionesProps, type SeccionxModuloProps } from "@/pages/GestionUsuarios/store/usuariosSlice";
import { ButtonCR } from "@/components/Button/ButtonCR";
type Props = {
    setStep: (step:number)=>void;
  categories?: SeccionxModuloProps[];
  // initialAssignedIds?: string[];
  onChange?: (assignedIds: string[]) => void;
}

// Las secciones del modulo siempre traen id y label
type SeccionAsignable = SeccionesEntidadProps & SeccionesProps;

interface ResolvedCategory extends SeccionxModuloProps {
  availableSections: SeccionAsignable[];
  assignedSections: SeccionAsignable[];
  totalCount: number;
  assignedCount: number;
}
 
export const StepModulos = ({
  onChange, setStep }: Props) => {
    const dispatch = useDispatch()
    const { obtenerSeccionxModuloUser, seccionesxModulo } = useGestionStore()
    const { entidades } = useSelector((state: RootState) => state.USER)
    useEffect(() => {
      obtenerSeccionxModuloUser()
    }, [])
 const [assignedIds, setAssignedIds] = useState<Set<string>>(
    () => new Set(entidades.map((e)=>`${e.id}`))
  );
  const [searchTerm, setSearchTerm] = useState<string>("");
  
  const emitChange = (next: Set<string>) => {
    setAssignedIds(next);
    onChange?.(Array.from(next));
  };
  const addSection = (sectionId: number) => {
    const next = new Set(assignedIds);
    next.add( sectionId.toString());
    emitChange(next);
  };
 
  const removeSection = (sectionId: number) => {
    const next = new Set(assignedIds);
    next.delete(sectionId.toString());
    emitChange(next);
  };
 
  const addAllInCategory = (categoryId: number) => {
    const category = seccionesxModulo.find((c) => c.id === categoryId);
    if (!category) return;
    const next = new Set(assignedIds);
    category.sections.forEach((section) => next.add(section.id.toString()));
    emitChange(next);
  };
 
  const removeAll = () => {
    emitChange(new Set());
  };
 
  const resolvedCategories: ResolvedCategory[] = useMemo(() => {
    const normalizedTerm = normalize(searchTerm.trim());
 
    return seccionesxModulo.map((category) => {
      const assignedSections: SeccionAsignable[] = category.sections
        .filter((s) => assignedIds.has(s.id.toString()))
        .map((s) => ({ ...s, id_modulo: category.id, entities: (s as SeccionesEntidadProps).entities ?? [] }));
      const availableSections: SeccionAsignable[] = category.sections
        .filter(
          (s) =>
            !assignedIds.has(s.id.toString()) &&
            (normalizedTerm === "" ||
              normalize(s.label).includes(normalizedTerm))
        )
        .map((s) => ({ ...s, id_modulo: category.id, entities: (s as SeccionesEntidadProps).entities ?? [] }));
      return {
        ...category,
        assignedSections,
        availableSections,
        totalCount: category.sections.length,
        assignedCount: assignedSections.length,
      };
    });
  }, [seccionesxModulo, assignedIds, searchTerm]);
  const totalAvailableCount = useMemo(
    () =>
      seccionesxModulo.reduce(
        (sum, category) =>
          sum +
          category.sections.filter((s) => !assignedIds.has(s.id.toString())).length,
        0
      ),
    [seccionesxModulo, assignedIds]
  );
  const onNextStep = ()=>{
  dispatch(addSeccionesxEntidad(resolvedCategories
        .flatMap((c) => c.assignedSections)));
  setStep(2);
  }
  const onBeforeStep = ()=>{
    setStep(0) // Assuming the previous step is 0 
  }
  return (
    <div className="section-assignment container-fluid py-4">
      <style>{styles}</style>
    <Row>
      <Col lg={5}>
          <AvailablePanel
            categories={resolvedCategories}
            searchTerm={searchTerm}
            totalAvailableCount={totalAvailableCount}
            onSearchChange={setSearchTerm}
            onAddSection={addSection}
            onAddAll={addAllInCategory}
          />
      </Col>
      <Col lg={7}>
          <AssignedPanel
            categories={resolvedCategories}
            assignedSectionsCount={assignedIds.size}
            onRemoveSection={removeSection}
            onRemoveAll={removeAll}
          />
      </Col>
    </Row>
    <div className="float-end">
      <ButtonCR label={'Siguiente'} onClick={onNextStep}/>
    </div>
    <div className="float-end">
      <ButtonCR label={'Atras'} variant='link' onClick={onBeforeStep}/>
    </div>
    </div>
  );
}
 
const styles = `
.section-assignment__title {
  font-size: 1.5rem;
  font-weight: 600;
}
.section-assignment__count {
  font-size: 0.9rem;
  color: #6c757d;
}
.section-assignment__link {
  font-size: 0.85rem;
  text-decoration: none;
}
.section-assignment__search {
  background-color: #f8f9fa;
}
.section-assignment__scroll {
  overflow-y: auto;
  max-height: 480px;
  padding-right: 0.25rem;
}
.section-assignment__group + .section-assignment__group {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #f1f1f1;
}
.section-assignment__group-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0;
}
.section-assignment__available-row {
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  background-color: #fff;
  padding: 0.5rem 0.75rem;
  color: #212529;
  transition: background-color 0.15s ease-in-out;
}
.section-assignment__available-row:hover {
  background-color: #f8f9fa;
}
.section-assignment__plus {
  color: #6c757d;
  font-weight: 600;
}
.section-assignment__badge {
  background-color: #3f6fa8;
  color: #fff;
  font-weight: 500;
  font-size: 0.85rem;
  padding: 0.45rem 0.6rem;
  border-radius: 0.375rem;
}
.section-assignment__badge-close {
  width: 0.6rem;
  height: 0.6rem;
  opacity: 0.85;
}
.section-assignment__badge-close:hover {
  opacity: 1;
}
.section-assignment__empty {
  color: #6c757d;
  font-size: 0.9rem;
}
`;
 

const normalize = (value: string): string =>
  value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
 


const SearchInput: React.FC<{
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
}> = ({ value, placeholder = "Buscar", onChange }) => {
  return (
    <input
      type="text"
      className="form-control section-assignment__search"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label={placeholder}
    />
  );
};
 //
const AvailableSectionRow: React.FC<{
  section: SeccionAsignable;
  onAdd: (sectionId: number) => void;
}> = ({ section, onAdd }) => {
  return (
    <button
      type="button"
      className="btn section-assignment__available-row d-flex align-items-center w-100 text-start"
      onClick={() => onAdd(section.id)}
    >
      <span className="section-assignment__plus me-2">+</span>
      <span>{section.label}</span>
    </button>
  );
};

//
const AvailableSeccionesxModulo: React.FC<{
  category: ResolvedCategory;
  onAddSection: (sectionId: number) => void;
  onAddAll: (categoryId: number) => void;
}> = ({ category, onAddSection, onAddAll }) => {
  if (category.availableSections.length === 0) {
    return null;
  }
  return (
    <div className="section-assignment__group">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h3 className="section-assignment__group-title">{category.label}</h3>
        <button
          type="button"
          className="btn btn-link btn-sm p-0 section-assignment__link"
          onClick={() => onAddAll(category.id)}
        >
          Añadir todo
        </button>
      </div>
 
      <div className="d-flex flex-column gap-2">
        {category.availableSections.map((section) => (
          <AvailableSectionRow
            key={section.id}
            section={section}
            onAdd={onAddSection}
          />
        ))}
      </div>
    </div>
  );
};


const AssignedSeccionesxModulo: React.FC<{
  category: ResolvedCategory;
  onRemoveSection: (sectionId: number) => void;
}> = ({ category, onRemoveSection }) => {
  if (category.assignedSections.length === 0) {
    return null;
  }
 
  return (
    <div className="section-assignment__group">
      <div className="d-flex align-items-baseline gap-2 mb-2">
        <h3 className="section-assignment__group-title mb-0">
          {category.label}
        </h3>
        <span className="section-assignment__count">
          {category.assignedCount} de {category.totalCount}
        </span>
      </div>
 
      <div className="d-flex flex-wrap gap-2">
        {category.assignedSections.map((section) => (
          // <BadgeCR
          //   key={section.id}
          //   label={section.label}
          //   id={section.id}
          //   onRemove={onRemoveSection}
          // />
          <button
              key={section.id}
              type="button"
              className="btn section-assignment__available-row d-flex align-items-center w-100 text-start"
              onClick={() => onRemoveSection(section.id)}
            >
              <span className="section-assignment__plus me-2">-</span>
              <span>{section.label}</span>
            </button>
        ))}
      </div>
    </div>
  );
};


const AvailablePanel: React.FC<{
  categories: ResolvedCategory[];
  searchTerm: string;
  totalAvailableCount: number;
  onSearchChange: (value: string) => void;
  onAddSection: (sectionId: number) => void;
  onAddAll: (categoryId: number) => void;
}> = ({
  categories,
  searchTerm,
  totalAvailableCount,
  onSearchChange,
  onAddSection,
  onAddAll,
}) => {
  const hasResults = categories.some(
    (category) => category.availableSections.length > 0
  );
 
  return (
    <div className="card" style={{height: '100%'}}>
      <div className="card-body ">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="section-assignment__title mb-0">Tus secciones</h2>
          <span className="section-assignment__count">
            {totalAvailableCount} sin asignar
          </span>
        </div>
 
        <SearchInput
          value={searchTerm}
          placeholder="Buscar sección"
          onChange={onSearchChange}
        />
 
        <div className="section-assignment__scroll mt-3">
          {hasResults ? (
            categories.map((category) => (
              <AvailableSeccionesxModulo
                key={category.id}
                category={category}
                onAddSection={onAddSection}
                onAddAll={onAddAll}
              />
            ))
          ) : (
            <p className="section-assignment__empty">
              No se encontraron secciones.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const AssignedPanel: React.FC<{
  categories: ResolvedCategory[];
  assignedSectionsCount: number;
  onRemoveSection: (sectionId: number) => void;
  onRemoveAll: () => void;
}> = ({ categories, assignedSectionsCount, onRemoveSection, onRemoveAll }) => {
  const assignedCategoriesCount = categories.filter(
    (category) => category.assignedSections.length > 0
  ).length;
  console.log({ccc: categories});
  
  return (
    <>
    <div className="card h-100">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="section-assignment__title mb-0">
            Asignados al usuario
          </h2>
          <div className="d-flex align-items-center gap-3">
            <span className="section-assignment__count">
              {assignedCategoriesCount} modulos, {assignedSectionsCount} secciones
            </span>
            <button
              type="button"
              className="btn btn-link btn-sm p-0 section-assignment__link"
              disabled={assignedSectionsCount === 0}
              onClick={onRemoveAll}
            >
              Quitar todo
            </button>
          </div>
        </div>
 
        <div className="section-assignment__scroll">
          {assignedSectionsCount === 0 ? (
            <p className="section-assignment__empty">
              Aún no hay secciones asignadas.
            </p>
          ) : (
            categories.map((category) => (
              <AssignedSeccionesxModulo
                key={category.id}
                category={category}
                onRemoveSection={onRemoveSection}
              />
            ))
          )}
        </div>
      </div>
    </div>
    </>
  );
};
 