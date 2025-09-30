// components/GuidancePanel.tsx (client) — updated

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Box, Paper, Typography } from "@mui/material";
import { useDaphneStore } from "@/store/useDaphneStore";
import {
  RuleGroupType,
  RuleType,
  Field,
  isRuleGroup,
  FlexibleOption,
} from "react-querybuilder";
import { queryBuilderGuidance } from "@/config/guidance";

type GuidanceItem = {
  id: string;
  top: number;
  height: number;
  hint: string;
};

type SelectorWithId = `${string}{id}${string}`;
type Props = { qbRootSelector: string; qbSelector: SelectorWithId };

export default function GuidancePanel({ qbRootSelector, qbSelector }: Props) {
  const {
    queryBuilder: { queryBuilderJson, fields },
  } = useDaphneStore();

  const [items, setItems] = useState<GuidanceItem[]>([]);
  const [containerHeight, setContainerHeight] = useState<number>(400);
  const raf = useRef<number | null>(null);
  const cardRefs = useRef<Map<string, HTMLDivElement | null>>(new Map());
  const GUTTER = 30;

  const hintsById = useMemo(() => {
    const map = new Map<string, string>();

    const formatValue = (rule: RuleType) => {
      const raw = rule.value;

      if (Array.isArray(raw)) return raw.join(", ");

      const field = fields.find((f: Field) => f.name === rule.field);
      if (field?.values) {
        const matched = field.values.find(
          (v) => (v as FlexibleOption).name === raw
        );
        return matched?.label ?? String(raw ?? "");
      }

      return String(raw ?? "");
    };

    const extractMap = (node?: RuleGroupType | RuleType) => {
      if (!node || !node.id) return;

      if (isRuleGroup(node)) {
        map.set(node.id, `Group (${(node.combinator ?? "AND").toUpperCase()})`);
        node.rules.forEach(extractMap);
        return;
      }

      const guidanceFormatter =
        node.field === "age"
          ? queryBuilderGuidance.ruleAge
          : queryBuilderGuidance.ruleConcept;

      const nodeGuidance = guidanceFormatter.replace("{X}", formatValue(node));
      map.set(node.id, nodeGuidance);
    };

    extractMap(queryBuilderJson);

    return map;
  }, [queryBuilderJson, fields]);

  useEffect(() => {
    function getAttrName(qbSelector: string): string {
      const match = qbSelector.match(/\[(.+?)=/);
      return match ? match[1] : "";
    }

    const qbRoot = document.querySelector(qbRootSelector) as HTMLElement | null;
    if (!qbRoot) return;

    const measure = () => {
      const rootTop = qbRoot.getBoundingClientRect().top + window.scrollY;
      const nodeEls = qbRoot.querySelectorAll<HTMLElement>(
        qbSelector.replace('="{id}"', "")
      );
      const next: GuidanceItem[] = [];
      nodeEls.forEach((el) => {
        const id = el.getAttribute(getAttrName(qbSelector));
        if (!id) return;
        const r = el.getBoundingClientRect();
        const top = r.top + window.scrollY - rootTop;
        next.push({
          id,
          top,
          height: 0,
          hint: hintsById.get(id) ?? "",
        });
      });

      setItems(next);
      setContainerHeight(qbRoot.scrollHeight);
    };

    const schedule = () => {
      if (raf.current) cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(measure);
    };

    const mo = new MutationObserver(schedule);
    mo.observe(qbRoot, { subtree: true, childList: true, attributes: true });

    const ro = new ResizeObserver(schedule);
    ro.observe(qbRoot);

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });

    return () => {
      mo.disconnect();
      ro.disconnect();
      window.removeEventListener("scroll", schedule);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [qbRootSelector, qbSelector, hintsById]);

  useEffect(() => {
    const qbRoot = document.querySelector(qbRootSelector) as HTMLElement | null;
    if (!qbRoot) return;

    const applyDynamicMargins = () => {
      if (!qbRoot) return;

      items.forEach((it) => {
        const selector = qbSelector.replace("{id}", CSS.escape(it.id));
        const centerEl = qbRoot.querySelector<HTMLElement>(selector);
        const cardEl = cardRefs.current.get(it.id);
        if (!centerEl || !cardEl) return;
        const centerH = centerEl.getBoundingClientRect().height;
        const guideH = cardEl.getBoundingClientRect().height;
        const extra =
          Math.max(0, guideH - centerH) + (guideH > centerH ? GUTTER : 0);
        const current = parseFloat(centerEl.style.marginBottom || "0");
        if (Math.abs(current - extra) > 0.5) {
          centerEl.style.marginBottom = `${extra}px`;
        }
      });
    };

    const id = requestAnimationFrame(applyDynamicMargins);

    const onResize = () => requestAnimationFrame(applyDynamicMargins);
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("resize", onResize);
    };
  }, [items, qbRootSelector, qbSelector]);

  return (
    <Box sx={{ position: "relative", height: containerHeight }}>
      {items.map((it) => (
        <Box
          key={it.id}
          sx={{
            position: "absolute",
            top: it.top,
            left: 0,
            right: 0,
            "&::before": {
              content: '""',
              position: "absolute",
              left: -12,
              top: 12,
              width: 8,
              height: 2,
              bgcolor: "divider",
            },
          }}
        >
          <Paper
            ref={(el) => {
              if (el) {
                cardRefs.current.set(it.id, el);
              } else {
                cardRefs.current.delete(it.id);
              }
            }}
            variant="outlined"
            sx={{ p: 1, mb: 1, fontSize: 12 }}
          >
            <Typography
              variant="caption"
              sx={{ display: "block", opacity: 0.7 }}
            >
              Guidance
            </Typography>
            <Typography variant="body2">{it.hint || "—"}</Typography>
          </Paper>
        </Box>
      ))}
    </Box>
  );
}
