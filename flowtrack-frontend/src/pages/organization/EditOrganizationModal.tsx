import Button from "../../components/Button";
import Modal from "../../components/Modal";
import Input from "../../components/Input";
import { useForm } from "react-hook-form";
import {
  organizationSchema,
  type OrganizationFormData,
} from "../../schemas/org.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building2 } from "lucide-react";

interface EditOrganizationModalProps {
  open: boolean;
  onClose: () => void;
}

export default function EditOrganizationModal({
  open,
  onClose,
}: EditOrganizationModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OrganizationFormData>({
    resolver: zodResolver(organizationSchema),
  });

  const onSubmit = () => {};

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Edit Organization"
      footer={
        <>
          <Button variant="outline-grey" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Save Changes</Button>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Organization Name"
          required
          type="text"
          placeholder="FlowTrack Pte Ltd"
          error={errors.name?.message}
          {...register("name")}
        />
        <Input
          label="Organization Email"
          required
          type="email"
          placeholder="company@example.com"
          error={errors.email?.message}
          helperText="All organization-related notifications will be sent to this email"
          {...register("email")}
        />
        <Input
          wrapperClassName="mt-4"
          label="Website"
          type="url"
          placeholder="yourwebsite@example.com"
          error={errors.website?.message}
          {...register("website")}
        />
        <div className="flex gap-4">
          <div className="flex flex-col items-center">
            <span className="text-sm font-medium">Organization Logo</span>
            <div className="bg-primary-light my-1 flex size-16 shrink-0 items-center justify-center rounded-xl sm:size-24">
              <Building2 className="text-primary size-9.5 sm:size-13" />
            </div>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Button variant="grey" size="sm">
              Change Logo
            </Button>
            <Button variant="grey-error" size="sm">
              Remove
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
