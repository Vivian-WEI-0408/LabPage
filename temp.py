"""合成生物学拨动开关（toggle switch）的动力学可视化。"""

import numpy as np
import matplotlib.pyplot as plt
from scipy.integrate import solve_ivp


# 模型参数：Hill 系数大于 2 时可产生足够强的协同抑制。
A1 = 3.0
A2 = 3.0
BETA = 4.0
GAMMA = 4.0
T_END = 30.0


def toggle_switch(_t, state):
    """返回拨动开关在状态 (u, v) 下的变化率 (du/dt, dv/dt)。"""
    u, v = state
    du_dt = A1 / (1.0 + v**BETA) - u
    dv_dt = A2 / (1.0 + u**GAMMA) - v
    return (du_dt, dv_dt)


def simulate(initial_state, time_points):
    """从指定初始状态数值求解微分方程。"""
    return solve_ivp(
        toggle_switch,
        (time_points[0], time_points[-1]),
        initial_state,
        t_eval=time_points,
        rtol=1e-8,
        atol=1e-10,
    )


def main():
    time_points = np.linspace(0.0, T_END, 1000)
    initial_states = [(0.2, 2.8), (2.8, 0.2), (0.7, 0.6), (0.6, 0.7)]
    colors = ["#1976d2", "#e64a19", "#7b1fa2", "#388e3c"]
    solutions = [simulate(state, time_points) for state in initial_states]

    fig, (ax_time, ax_phase) = plt.subplots(1, 2, figsize=(13, 5.5))

    # 时间序列：实线为 u，虚线为 v；同色曲线来自同一个初始状态。
    for state, color, solution in zip(initial_states, colors, solutions):
        label = f"initial (u, v) = ({state[0]}, {state[1]})"
        ax_time.plot(solution.t, solution.y[0], color=color, lw=2, label=label + ": u")
        ax_time.plot(solution.t, solution.y[1], color=color, lw=2, ls="--", label=label + ": v")

    ax_time.set_title("Toggle-switch time courses")
    ax_time.set_xlabel("Time")
    ax_time.set_ylabel("Protein concentration")
    ax_time.set_xlim(0, T_END)
    ax_time.set_ylim(bottom=0)
    ax_time.grid(alpha=0.25)
    ax_time.legend(fontsize=8, ncol=2)

    # 相平面方向场。
    axis_max = 3.3
    u_grid, v_grid = np.meshgrid(
        np.linspace(0.0, axis_max, 25), np.linspace(0.0, axis_max, 25)
    )
    du = A1 / (1.0 + v_grid**BETA) - u_grid
    dv = A2 / (1.0 + u_grid**GAMMA) - v_grid
    speed = np.hypot(du, dv)
    ax_phase.quiver(
        u_grid,
        v_grid,
        du / (speed + 1e-12),
        dv / (speed + 1e-12),
        speed,
        cmap="Greys",
        alpha=0.55,
        pivot="mid",
    )

    # 零增长曲线：du/dt=0 与 dv/dt=0；交点为稳态或鞍点。
    curve_axis = np.linspace(0.001, axis_max, 1500)
    u_nullcline = A1 / (1.0 + curve_axis**BETA)
    v_nullcline = A2 / (1.0 + curve_axis**GAMMA)
    ax_phase.plot(u_nullcline, curve_axis, color="#1565c0", lw=2.5, label="du/dt = 0")
    ax_phase.plot(curve_axis, v_nullcline, color="#c62828", lw=2.5, label="dv/dt = 0")

    for state, color, solution in zip(initial_states, colors, solutions):
        ax_phase.plot(solution.y[0], solution.y[1], color=color, lw=2)
        ax_phase.scatter(*state, color=color, s=35, marker="o", zorder=5)
        ax_phase.scatter(
            solution.y[0, -1], solution.y[1, -1],
            color=color, edgecolor="black", s=75, marker="*", zorder=6,
        )

    ax_phase.set_title("Phase plane and nullclines")
    ax_phase.set_xlabel("u concentration")
    ax_phase.set_ylabel("v concentration")
    ax_phase.set_xlim(0, axis_max)
    ax_phase.set_ylim(0, axis_max)
    ax_phase.set_aspect("equal", adjustable="box")
    ax_phase.grid(alpha=0.2)
    ax_phase.legend()

    fig.suptitle(
        rf"Mutual-repression toggle switch: $a_1={A1}$, $a_2={A2}$, "
        rf"$\beta={BETA}$, $\gamma={GAMMA}$",
        fontsize=14,
    )
    fig.tight_layout()
    output_file = "static/toggle_switch_dynamics.png"
    fig.savefig(output_file, dpi=300, bbox_inches="tight")
    print(f"Figure saved to {output_file}")
    plt.show()


if __name__ == "__main__":
    main()
