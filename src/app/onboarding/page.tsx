            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="big"
            style={{ width: "100%", justifyContent: "center", display: "flex", marginTop: 14, opacity: loading ? 0.7 : 1 }}
          >
            {loading ? "Setting things up…" : "Continue →"}
          </button>
        </form>