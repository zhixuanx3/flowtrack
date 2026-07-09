import Button from "../../../components/Button";
import Modal from "../../../components/Modal";
import Input from "../../../components/Input";
import Select from "../../../components/Select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import {
  inviteOrgMemberSchema,
  type InviteOrgMemberFormData,
} from "../../../schemas/orgMember.schema";
import { sendInvites } from "../../../api/invite";

interface InviteMembersModalProps {
  open: boolean;
  onClose: () => void;
}

export default function InviteMembersModal({
  open,
  onClose,
}: InviteMembersModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InviteOrgMemberFormData>({
    resolver: zodResolver(inviteOrgMemberSchema),
    defaultValues: { emails: "", role: "MEMBER" },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const inviteMutation = useMutation({
    mutationFn: (data: InviteOrgMemberFormData) => {
      const emails = data.emails
        .split(",")
        .map((email) => email.trim())
        .filter(Boolean);
      return sendInvites(emails, data.role);
    },
    onSuccess: handleClose,
  });

  const onSubmit = (data: InviteOrgMemberFormData) =>
    inviteMutation.mutate(data);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Invite Members"
      footer={
        <>
          <Button variant="outline-grey" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="invite-members-form"
            loading={inviteMutation.isPending}
          >
            Send Invite
          </Button>
        </>
      }
    >
      <form
        id="invite-members-form"
        onSubmit={handleSubmit(onSubmit)}
        className="flex gap-4"
      >
        <Input
          wrapperClassName="flex-1"
          label="Invite by Email"
          type="text"
          placeholder="Enter email addresses"
          error={errors.emails?.message}
          helperText="You can add multiple emails separated by commas"
          {...register("emails")}
        />
        <Select
          wrapperClassName="w-32 shrink-0"
          label="Role"
          error={errors.role?.message}
          {...register("role")}
        >
          <option value="MEMBER">Member</option>
          <option value="ADMIN">Admin</option>
        </Select>
      </form>
    </Modal>
  );
}
