              <label htmlFor="offerActive" style={{ fontSize: 13, cursor: "pointer", fontWeight: 600 }}>Set as Active immediately</label>
            </div>

            <Button type="submit" disabled={createOfferMutation.isPending || updateOfferMutation.isPending || isSaving} icon={<IconPlus size={14} />}>
              {(createOfferMutation.isPending || updateOfferMutation.isPending || isSaving)
                ? (editId ? "Updating Offer..." : "Saving Offer...")
                : editId ? "Update Offer" : "Save Offer"}
            </Button>